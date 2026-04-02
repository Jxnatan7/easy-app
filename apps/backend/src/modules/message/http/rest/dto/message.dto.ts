import { ChatUser } from "src/chat/core/schemas/chat.schema";

export class MessageDto {
  readonly sender: ChatUser;
  readonly content: string;
  readonly timestamp: Date;
}
