import { User } from "src/user/core/schemas/user.schema";

export class SimpleUser {
  private readonly id: string;
  private readonly name: string;
  private readonly email: string;
  private readonly token: string;

  private constructor(id: string, name: string, email: string, token: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.token = token;
  }

  public static createFromUser(user: User): SimpleUser {
    if (!user.id || !user.name || !user.email) {
      throw new Error("Dados do usuário inválidos para criação de SimpleUser.");
    }

    return new SimpleUser(String(user.id), user.name, user.email, user.token);
  }
}
