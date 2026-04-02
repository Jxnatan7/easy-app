import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./core/schemas/chat.schema";
import { WsJwtGuard } from "src/auth/guards/ws-jwt.guard";
import { ChatService } from "./core/services/chat.service";
import { ConfigModule } from "@nestjs/config";
import { ChatGateway } from "./gateways/chat.gateway";
import { UserModule } from "src/user/user.module";
import { CommunicationRequestModule } from "src/communication-request/communication-request.module";
import { AuthModule } from "src/auth/auth.module";
import {
  CommunicationRequest,
  CommunicationRequestSchema,
} from "src/communication-request/core/schemas/communication-request.schema";
import { ChatController } from "./http/rest/controller/chat.controller";
import {
  Message,
  MessageSchema,
} from "src/message/core/schemas/message.schema";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: CommunicationRequest.name, schema: CommunicationRequestSchema },
    ]),
    UserModule,
    forwardRef(() => CommunicationRequestModule),
    forwardRef(() => AuthModule),
  ],
  providers: [ChatService, WsJwtGuard, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
