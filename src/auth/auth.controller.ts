import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/models/create-user.dto';
import { UserDto } from 'src/users/models/user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJWTAuthGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async Login(@Req() request: Request) {
    return this.authService.Login(request.user as UserDto);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async SignUp(@Body() signupDto: CreateUserDto) {
    return this.authService.SignUp(signupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async getProtected(@Req() request: Request) {
    return request.user;
  }

  @UseGuards(RefreshJWTAuthGuard)
  @Get('refresh')
  async refreshToken(@Req() request: Request) {
    const refreshToken = request
      .get('authorization')
      ?.replace('Bearer', '')
      .trim() as string;
    return this.authService.refreshToken(refreshToken);
  }
}
