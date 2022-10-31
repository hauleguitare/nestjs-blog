import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUserAlreadyExist } from 'src/common/decorators/Is-user-already-exist.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsUserAlreadyExist({ message: '$value already exist' })
  @ApiProperty()
  email: string;

  @IsUserAlreadyExist({ message: '$value already exist' })
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
}
