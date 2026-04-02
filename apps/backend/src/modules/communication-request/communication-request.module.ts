import { forwardRef, Module } from "@nestjs/common";
import {
  CommunicationRequest,
  CommunicationRequestSchema,
} from "./core/schemas/communication-request.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { CommunicationRequestController } from "./http/rest/controller/communication-request.controller";
import { CommunicationRequestService } from "./core/services/communication-request.service";
import { UserModule } from "src/user/user.module";
import { ChatModule } from "src/chat/chat.module";
import {
  Message,
  MessageSchema,
} from "src/message/core/schemas/message.schema";
import { CommunicationEventListener } from "./core/listeners/communication.listener";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommunicationRequest.name, schema: CommunicationRequestSchema },
    ]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UserModule,
    forwardRef(() => ChatModule),
  ],
  controllers: [CommunicationRequestController],
  providers: [CommunicationRequestService, CommunicationEventListener],
  exports: [CommunicationRequestService],
})
export class CommunicationRequestModule {}
