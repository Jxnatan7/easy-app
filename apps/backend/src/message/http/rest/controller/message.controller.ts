import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  FilterRequest,
  PaginatedResult,
} from "src/@core/services/mongo-query.service";
import { MessageDocument } from "src/message/core/schemas/message.schema";
import { MessageService } from "src/message/core/services/message.service";

@Controller("api/messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @HttpCode(200)
  @Post(":chatId")
  @UseGuards(AuthGuard("jwt"))
  async getMessages(
    @Param("chatId") chatId: string,
    @Body() filterRequest: FilterRequest,
  ): Promise<PaginatedResult<MessageDocument>> {
    return this.messageService.getMessagesByChatId(chatId, filterRequest);
  }
}
