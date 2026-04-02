import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum CommunicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DENIED = "DENIED",
  FINALIZED = "FINALIZED",
}

@Schema({ timestamps: true, collection: "communication_requests" })
export class CommunicationRequest extends Document {
  @Prop({ required: true })
  visitorName: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  visitorId: string;

  @Prop()
  visitorToken: string;

  @Prop()
  visitorContact: string;

  @Prop({ required: true })
  initialMessage: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Chat" })
  chatId: string;

  @Prop({
    required: true,
    enum: CommunicationStatus,
    default: CommunicationStatus.PENDING,
  })
  status: CommunicationStatus;
}

export const CommunicationRequestSchema =
  SchemaFactory.createForClass(CommunicationRequest);
