import { CommunicationStatus } from "src/communication-request/core/schemas/communication-request.schema";

export class ValidateCommunicationRequestDto {
  readonly status: CommunicationStatus;
}
