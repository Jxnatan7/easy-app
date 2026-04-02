import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ChatService } from "../core/services/chat.service";
import { User } from "src/user/core/schemas/user.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Message } from "src/message/core/schemas/message.schema";
import { CommunicationRequest } from "src/communication-request/core/schemas/communication-request.schema";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  path: "/ws/chat",
})
@Injectable()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  private roomSocketsCount = new Map<string, number>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  afterInit() {
    this.logger.log("ChatGateway initialized");
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) throw new UnauthorizedException("Token missing");
      const payload = await this.jwtService.verifyAsync(token);
      client.data.userId = payload.sub;
      client.data.role = payload.role;

      const userRoom = `user:${client.data.userId}`;
      await client.join(userRoom);
      this.logger.log(`Socket ${client.id} joined personal room ${userRoom}`);
    } catch (err) {
      this.logger.warn(`Connection rejected: ${client.id} - ${err.message}`);
      client.emit("error", "Unauthorized");
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [room, count] of this.roomSocketsCount.entries()) {
      if (client.rooms.has(room)) {
        const next = Math.max(0, count - 1);
        if (next === 0) this.roomSocketsCount.delete(room);
        else this.roomSocketsCount.set(room, next);
      }
    }
  }

  emitToUser(userId: string, event: string, payload: any) {
    try {
      const room = `user:${userId}`;
      if (!this.server) {
        this.logger.warn("Attempt to emit but server not ready");
        return;
      }
      this.server.to(room).emit(event, payload);
      this.logger.log(`Emitted ${event} to ${room}`);
    } catch (err) {
      this.logger.error("emitToUser failed", err);
    }
  }

  notifyNewCommunicationRequest(
    targetUserId: string,
    requestData: CommunicationRequest,
  ) {
    const room = `user:${targetUserId}`;
    if (!this.server) {
      this.logger.warn("Server not ready to emit notification");
      return;
    }
    this.server.to(room).emit("new_communication_request", requestData);
    this.logger.log(`Notification sent to ${room}`);
  }

  notifyUpdateCommunicationRequest(
    targetUserId: string,
    requestData: CommunicationRequest,
  ) {
    const room = `user:${targetUserId}`;
    if (!this.server) {
      this.logger.warn("Server not ready to emit notification");
      return;
    }
    this.server.to(room).emit("update_communication_request", requestData);
    this.handleFinishChat(requestData.chatId);
    this.logger.log(`Notification sent to ${room}`);
  }

  private extractToken(client: Socket) {
    const qsToken = client.handshake.query?.token;
    if (typeof qsToken === "string") return qsToken;
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader && typeof authHeader === "string") {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") return parts[1];
    }
    return null;
  }

  @SubscribeMessage("join")
  async handleJoin(
    @MessageBody() payload: { communicationRequestId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { communicationRequestId } = payload;
    const userId = client.data.userId as string;

    if (!Types.ObjectId.isValid(communicationRequestId)) {
      client.emit("join_error", "Invalid communicationRequestId");
      return;
    }

    try {
      const chat = await this.chatService.getChatByCommunicationRequest(
        communicationRequestId,
      );

      const isParticipant = chat.participants.some(
        (p) => p.toString() === userId,
      );

      if (!isParticipant) {
        client.emit("join_error", "User is not a participant of this chat");
        return;
      }

      const room = this.roomName(communicationRequestId);

      const socketsInRoom =
        this.server.sockets.adapter.rooms.get(room) ?? new Set();
      const distinctUserIds = new Set<string>();
      for (const sid of socketsInRoom) {
        const s = this.server.sockets.sockets.get(sid);
        if (s?.data?.userId) distinctUserIds.add(s.data.userId);
      }
      distinctUserIds.add(userId);

      if (distinctUserIds.size > 2) {
        client.emit("join_error", "Room already has two distinct participants");
        return;
      }

      await client.join(room);

      this.roomSocketsCount.set(
        room,
        (this.roomSocketsCount.get(room) ?? 0) + 1,
      );

      client.emit("joined", { room, chatId: String(chat._id) });
      this.server.to(room).emit("participant_joined", { userId });
      this.logger.log(`User ${userId} joined room ${room}`);
    } catch (err) {
      client.emit("join_error", err.message || "Failed to join");
    }
  }

  @SubscribeMessage("joinByChat")
  async handleJoinByChat(
    @MessageBody() payload: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId } = payload;
    const userId = client.data.userId as string;

    if (!Types.ObjectId.isValid(chatId)) {
      client.emit("join_error", "Invalid chatId");
      return;
    }

    try {
      const chat = await this.chatService.getChatById(chatId);
      if (!chat) {
        client.emit("join_error", "Chat not found");
        return;
      }

      const isParticipant = chat.participants.some(
        (p) => p.toString() === userId,
      );

      if (!isParticipant) {
        client.emit("join_error", "User is not a participant of this chat");
        return;
      }

      const room = `chat:${String(chat._id)}`;

      const socketsInRoom =
        this.server.sockets.adapter.rooms.get(room) ?? new Set();
      const distinctUserIds = new Set<string>();
      for (const sid of socketsInRoom) {
        const s = this.server.sockets.sockets.get(sid);
        if (s?.data?.userId) distinctUserIds.add(s.data.userId);
      }
      distinctUserIds.add(userId);

      if (distinctUserIds.size > 2) {
        client.emit("join_error", "Room already has two distinct participants");
        return;
      }

      await client.join(room);
      this.roomSocketsCount.set(
        room,
        (this.roomSocketsCount.get(room) ?? 0) + 1,
      );

      client.emit("joined", { room, chatId: String(chat._id) });
      this.server.to(room).emit("participant_joined", { userId });
      this.logger.log(`User ${userId} joined room ${room}`);
    } catch (err) {
      client.emit("join_error", err.message || "Failed to join by chatId");
    }
  }

  @SubscribeMessage("leave")
  async handleLeave(
    @MessageBody() payload: { communicationRequestId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.roomName(payload.communicationRequestId);
    if (client.rooms.has(room)) {
      await client.leave(room);
      const prev = Math.max(0, this.roomSocketsCount.get(room) ?? 1);
      if (prev <= 1) this.roomSocketsCount.delete(room);
      else this.roomSocketsCount.set(room, prev - 1);
      client.emit("left", { room });
      this.server
        .to(room)
        .emit("participant_left", { userId: client.data.userId });
    } else {
      client.emit("leave_error", "Not in room");
    }
  }

  async handleFinishChat(chatId: string) {
    const room = this.roomName(chatId);

    this.server.to(room).emit("onChat", {
      action: "FINISHED",
    });
  }

  @SubscribeMessage("message")
  async handleMessage(
    @MessageBody()
    payload: { chatId: string; content: string; timestamp: Date },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, content, timestamp } = payload;
    const userId = client.data.userId as string;

    if (!content || content.trim().length === 0) {
      client.emit("message_error", "Empty message");
      return;
    }

    try {
      const chat = await this.chatService.getChatById(chatId);

      if (!chat) {
        client.emit("message_error", "Chat not found");
        return;
      }

      const isParticipant = chat.participants.some(
        (p) => p.toString() === userId,
      );

      if (!isParticipant) {
        client.emit("message_error", "User not participant of this chat");
        return;
      }

      const sender = await this.userModel.findById(userId);

      if (!sender) {
        client.emit("message_error", "User not found");
        return;
      }

      const message = new this.messageModel({
        sender: {
          _id: sender._id,
          name: sender.name,
          role: sender.role,
        },
        chatId: chatId,
        content,
        timestamp: timestamp,
      });

      const messageSaved = await message.save();

      const room = this.roomName(chatId);

      this.server.to(room).emit("message", {
        ...messageSaved.toObject(),
        chatId: chatId,
      });
    } catch (err) {
      console.error("Erro ao salvar mensagem:", err);
      client.emit("message_error", err.message || "Failed to send message");
    }
  }

  private roomName(communicationRequestId: string) {
    return `chat:${communicationRequestId}`;
  }
}
