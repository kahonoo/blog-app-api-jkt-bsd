import { ApiError } from "../../utils/apiError";
import { JwtService } from "../jwt/jwt.service";
import { PasswordService } from "../password/password.service";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";

export class AuthService {
  private prismaService: PrismaService;
  private passwordService: PasswordService;
  private jwtService: JwtService;
  constructor() {
    this.prismaService = new PrismaService();
    this.passwordService = new PasswordService();
    this.jwtService = new JwtService();
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

  login = async (body: LoginDTO) => {
    const user = await this.prismaService.user.findFirst({
      where: { email: body.email },
    });
    if (!user) {
      throw new ApiError("invalid credentials", 400 );
    }
    const isPasswordValid = await this.passwordService.comparePassword(
      body.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError("invalid credentials", 400);
    }

    const payload = { id: user.id };

    const accessToken = this.jwtService.generateToken(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, accessToken };
  };
}
