import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/user/core/schemas/user.schema";

export type ChatDocument = Chat & Document;

export class ChatUser extends User {}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatUser);

@Schema({ timestamps: true, collection: "chats" })
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: "CommunicationRequest", required: true })
  communicationRequestId: Types.ObjectId;

  @Prop({ default: [] })
  participants: ChatUser[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
