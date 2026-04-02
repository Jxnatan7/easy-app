import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { CommunicationRequestService } from "src/communication-request/core/services/communication-request.service";
import { CreateCommunicationRequestDto } from "src/communication-request/http/rest/dto/create-communication-request.dto";
import { CommunicationRequestDto } from "../dto/communication-request.dto";
import { ValidateCommunicationRequestDto } from "../dto/validation-communication-request.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Public } from "src/decorators/public.decorator";
import {
  FilterRequest,
  PaginatedResult,
} from "src/@core/services/mongo-query.service";
import { CommunicationRequest } from "src/communication-request/core/schemas/communication-request.schema";

@UseGuards(JwtAuthGuard)
@Controller("api/communication-requests")
export class CommunicationRequestController {
  constructor(
    private readonly communicationRequestService: CommunicationRequestService,
  ) {}

  @Public()
  @Post()
  async create(
    @Body() createCommunicationRequestDto: CreateCommunicationRequestDto,
  ): Promise<CommunicationRequestDto> {
    return this.communicationRequestService.create(
      createCommunicationRequestDto,
    );
  }

  @HttpCode(200)
  @Post(":id/validate")
  async validate(
    @Param("id") id: string,
    @Body() validateCommunicationRequestDto: ValidateCommunicationRequestDto,
  ): Promise<CommunicationRequestDto> {
    return this.communicationRequestService.validate(
      id,
      validateCommunicationRequestDto,
    );
  }

  @HttpCode(200)
  @Post("/search/:userId")
  async listByUserId(
    @Param("userId") userId: string,
    @Body() filterRequest: FilterRequest,
  ): Promise<PaginatedResult<CommunicationRequest>> {
    return this.communicationRequestService.listByUserId(userId, filterRequest);
  }
}
