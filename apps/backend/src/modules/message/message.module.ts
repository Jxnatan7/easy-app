import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./core/schemas/message.schema";
import { WsJwtGuard } from "src/auth/guards/ws-jwt.guard";
import { MessageService } from "./core/services/message.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { MessageController } from "./http/rest/controller/message.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UserModule,
    forwardRef(() => AuthModule),
  ],
  providers: [MessageService, WsJwtGuard],
  controllers: [MessageController],
  exports: [MessageService, MongooseModule],
})
export class MessageModule {}
