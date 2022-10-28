import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/models/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './models/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async Login(@Body() signinDto: SignInDto) {
    return this.authService.Login(signinDto);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async SignUp(@Body() signupDto: CreateUserDto) {
    return this.authService.SignUp(signupDto);
  }
}
