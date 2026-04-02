import { CommunicationRequest } from "../schemas/communication-request.schema";

export class CommunicationRequestEvent {
  constructor(
    public readonly payload: CommunicationRequest,
    public readonly userId: string,
  ) {}
}
