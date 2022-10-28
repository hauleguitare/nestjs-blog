import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/models/user.dto';
import { UserService } from 'src/users/user.services';
import { SignInDto } from './models/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/models/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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
}
