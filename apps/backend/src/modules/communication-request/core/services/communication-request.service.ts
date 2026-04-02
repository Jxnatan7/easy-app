import { InjectModel } from "@nestjs/mongoose";
import {
  CommunicationRequest,
  CommunicationStatus,
} from "../schemas/communication-request.schema";
import { Model, Types } from "mongoose";
import { User, UserRole } from "src/user/core/schemas/user.schema";
import { CommunicationRequestDto } from "src/communication-request/http/rest/dto/communication-request.dto";
import { ValidateCommunicationRequestDto } from "src/communication-request/http/rest/dto/validation-communication-request.dto";
import { ChatService } from "src/chat/core/services/chat.service";
import { ChatGateway } from "src/chat/gateways/chat.gateway";
import { CreateCommunicationRequestDto } from "src/communication-request/http/rest/dto/create-communication-request.dto";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Message } from "src/message/core/schemas/message.schema";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CommunicationRequestEvent } from "../events/communication-request.event";
import {
  createMongoQueryService,
  FilterRequest,
  PaginatedResult,
} from "src/@core/services/mongo-query.service";

@Injectable()
export class CommunicationRequestService {
  constructor(
    @InjectModel(CommunicationRequest.name)
    private readonly communicationRequestModel: Model<CommunicationRequest>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,

    readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    requestData: CreateCommunicationRequestDto,
  ): Promise<CommunicationRequestDto> {
    const savedRequest = await this.saveCommunicationRequest(requestData);
    const userSaved = await this.attachRequestToUser(savedRequest);
    const updatedRequest = await this.attachUserToRequest(
      savedRequest.id as string,
      userSaved,
    );

    return CommunicationRequestDto.create(updatedRequest);
  }

  async validate(
    id: string,
    validateCommunicationRequestDto: ValidateCommunicationRequestDto,
  ) {
    const communicationRequest = await this.communicationRequestModel
      .findByIdAndUpdate(
        id,
        { $set: { status: validateCommunicationRequestDto.status } },
        { new: true },
      )
      .exec();

    if (!communicationRequest) {
      throw new NotFoundException("Communication request not found");
    }

    if (communicationRequest.status !== CommunicationStatus.ACCEPTED) {
      this.eventEmitter.emit(
        "communication.updated",
        new CommunicationRequestEvent(
          communicationRequest,
          communicationRequest.userId.toString(),
        ),
      );

      return CommunicationRequestDto.create(communicationRequest);
    }

    if (communicationRequest.chatId) {
      const existing = await this.communicationRequestModel.findById(id).exec();
      return CommunicationRequestDto.create(existing as CommunicationRequest);
    }

    if (!communicationRequest.visitorId) {
      throw new BadRequestException("CommunicationRequest has no visitorId");
    }

    const visitorId = communicationRequest.visitorId.toString();

    const distinctParticipants = Array.from(
      new Set([communicationRequest.userId.toString(), visitorId]),
    );

    if (distinctParticipants.length > 2) {
      throw new BadRequestException("Too many distinct participants");
    }

    const createdChat = await this.chatService.createChat(
      String(communicationRequest.id),
      distinctParticipants,
    );

    const initialMessage = {
      content: communicationRequest.initialMessage,
      sender: {
        name: communicationRequest.visitorName,
        role: UserRole.VISITOR,
        _id: visitorId,
        userId: visitorId,
      },
      chatId: String(createdChat._id),
      timestamp: new Date(),
    };

    const message = new this.messageModel(initialMessage);
    await message.save();

    try {
      this.chatGateway.emitToUser(visitorId, "communication_accepted", {
        communicationRequestId: id,
        chatId: String(createdChat._id),
      });
    } catch (err) {}

    return CommunicationRequestDto.create(communicationRequest);
  }

  private async saveCommunicationRequest(
    requestData: CreateCommunicationRequestDto,
  ): Promise<CommunicationRequest> {
    const communicationRequest = new this.communicationRequestModel(
      requestData,
    );

    const communicationCreated: CommunicationRequest =
      await communicationRequest.save();

    if (communicationCreated.id) {
      this.eventEmitter.emit(
        "communication.created",
        new CommunicationRequestEvent(
          communicationCreated,
          communicationCreated.userId.toString(),
        ),
      );
    }

    return communicationCreated;
  }

  private async attachRequestToUser(
    communicationRequest: CommunicationRequest,
  ): Promise<User> {
    const createVisitorUserRequest = {
      name: communicationRequest.visitorName,
      role: UserRole.VISITOR,
      communicationRequestId: communicationRequest.id as Types.ObjectId,
    };
    const user = new this.userModel(createVisitorUserRequest);
    return user.save();
  }

  private async attachUserToRequest(
    id: string,
    user: User,
  ): Promise<CommunicationRequest> {
    const updatedCommunicationRequest = await this.communicationRequestModel
      .findByIdAndUpdate(
        id,
        { $set: { visitorId: user.id, visitorToken: user.token } },
        { new: true },
      )
      .exec();

    if (!updatedCommunicationRequest) {
      throw new Error("Failed to update communication request");
    }
    return updatedCommunicationRequest;
  }

  async listByUserId(
    userId: string,
    filterRequest: FilterRequest,
  ): Promise<PaginatedResult<CommunicationRequest>> {
    const baseQuery = { userId };
    const query = createMongoQueryService<CommunicationRequest>(
      this.communicationRequestModel,
    );
    return query.search({
      baseQuery,
      filterRequest,
      options: {
        searchableFields: ["visitorName", "initialMessage"],
        dateField: "createdAt",
      },
    });
  }
}
