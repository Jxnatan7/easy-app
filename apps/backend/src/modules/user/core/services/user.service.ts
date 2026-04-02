import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserRole } from "../schemas/user.schema";
import { CreateUserDto } from "src/user/http/rest/dto/create-user.dto";
import { generateCode } from "src/helpers/generateCode";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.ensureEmailIsUnique(createUserDto.email);
    const code = await this.getUniqueCode();

    const user = new this.userModel({
      ...createUserDto,
      code,
      role: UserRole.USER,
    });

    return user.save();
  }

  private async getUniqueCode(): Promise<string> {
    const code = generateCode();
    const existingUser = await this.findByCode(code);
    return existingUser ? this.getUniqueCode() : code;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByCode(code: string): Promise<User | null> {
    const user = this.userModel.findOne({ code }).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException("Email is already in use");
    }
  }

  async update(id: string, payload: CreateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, payload, { new: true });
  }
}
