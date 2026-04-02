import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Chat, ChatDocument } from "../schemas/chat.schema";
import { CommunicationRequest } from "src/communication-request/core/schemas/communication-request.schema";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(CommunicationRequest.name)
    private readonly communicationRequestModel: Model<CommunicationRequest>,
  ) {}

  async createChat(
    communicationRequestId: string,
    participants: string[],
  ): Promise<Chat> {
    const chat = new this.chatModel({
      communicationRequestId,
      participants,
      messages: [],
    });
    const saved = await chat.save();

    await this.communicationRequestModel.findByIdAndUpdate(
      communicationRequestId,
      { $set: { chatId: saved._id } },
    );

    return saved;
  }

  async getChatByCommunicationRequest(
    communicationRequestId: Types.ObjectId | string,
  ): Promise<Chat> {
    const chat = await this.chatModel
      .findOne({ communicationRequestId })
      .exec();
    if (!chat) {
      throw new NotFoundException("Chat not found");
    }
    return chat;
  }

  async getChatById(chatId: string | Types.ObjectId): Promise<Chat> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) throw new NotFoundException("Chat not found");
    return chat;
  }
}
