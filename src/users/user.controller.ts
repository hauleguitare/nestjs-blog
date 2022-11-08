import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from './models/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':uid')
  async findOne(@Param('uid') userId: string): Promise<UserDto> {
    return this.userService.findOne(userId);
  }

  @Delete(':uid')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param('uid') userId: string): Promise<UserDto> {
    return this.userService.deleteOne(userId);
  }
}
