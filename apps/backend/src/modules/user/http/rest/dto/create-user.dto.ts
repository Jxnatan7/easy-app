import { UserRole } from "src/user/core/schemas/user.schema";

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly code: string;
  readonly phone: string;
  readonly communicationRequestId: string;

  constructor(createUserDto: CreateUserDto) {
    this.name = createUserDto.name;
    this.email = createUserDto.email;
    this.password = createUserDto.password;
    this.code = createUserDto.code;
    this.phone = createUserDto.phone;
    this.communicationRequestId = createUserDto.communicationRequestId;
    this.role = UserRole.USER;
  }
}
