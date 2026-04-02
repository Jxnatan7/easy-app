import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ChatUser } from "src/chat/core/schemas/chat.schema";

export type MessageDocument = Message & Document;

@Schema({ timestamps: true, collection: "messages" })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: "Chat", required: true })
  chatId: Types.ObjectId;

  @Prop({ required: true })
  sender: ChatUser;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  timestamp: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
