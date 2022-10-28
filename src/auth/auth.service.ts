import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/models/create-user.dto';
import { UserDto } from 'src/users/models/user.dto';
import { UserService } from 'src/users/user.services';
import { IAuthenticatePayload } from './interfaces/Authenticate-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
    return this.userService.createUser(createUserDto);
  }

  async Login(user: UserDto) {
    const payload = this.registerPayload(user);
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  private registerPayload(user: UserDto): IAuthenticatePayload {
    return {
      ...user,
      sub: user.uid,
    };
  }
}
