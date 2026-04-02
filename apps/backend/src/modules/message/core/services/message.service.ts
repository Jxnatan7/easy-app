import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message, MessageDocument } from "../schemas/message.schema";
import {
  createMongoQueryService,
  FilterRequest,
  PaginatedResult,
} from "src/@core/services/mongo-query.service";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async getMessagesByChatId(
    chatId: string,
    filterRequest: FilterRequest,
  ): Promise<PaginatedResult<MessageDocument>> {
    const baseQuery = { chatId: chatId };
    const query = createMongoQueryService<MessageDocument>(this.messageModel);
    const result = await query.search({
      baseQuery,
      filterRequest,
      options: {
        dateField: "timestamp",
        allowedSortFields: ["timestamp"],
      },
    });

    return result;
  }
}
