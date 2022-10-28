import { Controller, Get } from '@nestjs/common';
import { UserDto } from './models/user.dto';
import { UserService } from './user.services';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }
}
