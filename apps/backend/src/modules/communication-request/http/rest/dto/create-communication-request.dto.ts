import { CommunicationStatus } from "src/communication-request/core/schemas/communication-request.schema";

export class CreateCommunicationRequestDto {
  readonly visitorName: string;
  readonly visitorContact: string;
  readonly initialMessage: string;
  readonly status: CommunicationStatus;
  readonly visitorId: string;
  readonly userId: string;
}
