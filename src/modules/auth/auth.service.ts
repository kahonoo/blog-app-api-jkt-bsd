import { ApiError } from "../../utils/apiError";
import { PasswordService } from "../password/password.service";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";

export class AuthService {
  private prismaService: PrismaService;
  private passwordService: PasswordService;
  constructor() {
    this.prismaService = new PrismaService();
    this.passwordService = new PasswordService();
  }

  register = async (body: RegisterDTO) => {
    const user = await this.prismaService.user.findFirst({
      where: { email: body.email },
    });

    if (user) {
      throw new ApiError("email already used", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      body.password
    );

    return await this.prismaService.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },

      omit: { password: true },
    });
  };
}
