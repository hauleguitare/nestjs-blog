import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/models/create-user.dto';
import { UserDto } from 'src/users/models/user.dto';
import { UserService } from 'src/users/user.service';
import { IAuthenticatePayload } from './interfaces/Authenticate-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async ValidateUser(usernameOrEmail: string, password: string) {
    const user = await this.userService.findUsernameOrEmail(usernameOrEmail);
    if (!user) {
      throw new NotFoundException('user is not exist');
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (isValid) {
      const dateLogin = new Date();
      await this.userService.updateTimeLogin(user.uid, dateLogin);
      user.lastLogin = dateLogin;
      return plainToClass(UserDto, user);
    }
    throw new UnauthorizedException('password is not valid!');
  }

  async SignUp(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return this.Login(user);
  }

  async Login(user: UserDto) {
    const payload = this.registerPayload(user);
    const [accessToken, refreshToken] = await this.getTokens(payload);
    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  private async getTokens(payload: IAuthenticatePayload) {
    const accessToken = this.getAccessToken(payload);

    const refreshToken = this.getRefreshToken(payload);
    return Promise.all([accessToken, refreshToken]);
  }

  private async getAccessToken(payload: IAuthenticatePayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SERCET_KEY'),
      expiresIn: 60 * 60,
    });
  }

  private async getRefreshToken(
    payload: IAuthenticatePayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SERCET_KEY'),
      expiresIn: 3600 * 24 * 7,
    });
  }

  async refreshToken(refreshToken: string) {
    const decode = this.jwtService.decode(
      refreshToken,
    ) as IAuthenticatePayload | null;
    if (!decode) {
      throw new InternalServerErrorException('error when decode refresh token');
    }
    const { iat, exp, ...user } = decode;
    const accessToken = await this.getAccessToken(user as IAuthenticatePayload);
    return { accessToken };
  }

  private registerPayload(user: UserDto): IAuthenticatePayload {
    return {
      ...user,
      sub: user.uid,
    };
  }
}
