import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/models/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignInDto } from './models/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async Login(@Req() request: Request) {
    return request.user;
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async SignUp(@Body() signupDto: CreateUserDto) {
    return this.authService.SignUp(signupDto);
  }
}
