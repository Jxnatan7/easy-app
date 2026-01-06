import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "src/user/core/services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { SimpleUser } from "../dto/simple-user.dto";
import { AdminGuard } from "src/auth/guards/admin.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Public } from "src/decorators/public.decorator";

@Controller("api/users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createUserRequest: CreateUserDto) {
    const user = await this.userService.create(createUserRequest);
    return SimpleUser.createFromUser(user);
  }

  @HttpCode(200)
  @Get("/:id")
  async findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @HttpCode(200)
  @Public()
  @Get("code/:code")
  async findByCode(@Param("code") code: string) {
    const user = await this.userService.findByCode(code);
    if (user) {
      return SimpleUser.createFromUser(user);
    }
  }

  @Put("/:id")
  async update(@Param("id") id: string, @Body() payload: CreateUserDto) {
    return this.userService.update(id, payload);
  }
}
