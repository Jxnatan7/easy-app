import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ChatGateway } from "src/chat/gateways/chat.gateway";
import { CommunicationRequestEvent } from "../events/communication-request.event";

@Injectable()
export class CommunicationEventListener {
  private readonly logger = new Logger(CommunicationEventListener.name);

  constructor(private readonly chatGateway: ChatGateway) {}

  @OnEvent("communication.created", { async: true })
  async handleCommunicationCreatedEvent(event: CommunicationRequestEvent) {
    this.logger.log(`Evento recebido: Nova request ${event.payload.id}`);

    try {
      this.chatGateway.notifyNewCommunicationRequest(
        event.userId,
        event.payload,
      );
    } catch (error) {
      this.logger.error("Erro ao notificar via socket", error);
    }
  }

  @OnEvent("communication.updated", { async: true })
  async handleCommunicationUpdatedEvent(event: CommunicationRequestEvent) {
    this.logger.log(`Evento recebido: Request atualizada ${event.payload.id}`);

    this.chatGateway.notifyUpdateCommunicationRequest(
      event.userId,
      event.payload,
    );
  }
  catch(error) {
    this.logger.error("Erro ao notificar via socket", error);
  }
}
