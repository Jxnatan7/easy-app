import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket & { user?: any }>();
    const token = client.handshake.query.token as string;

    if (!token) {
      return false;
    }
    try {
      const payload = this.jwtService.verify(token);
      client.user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }
}
