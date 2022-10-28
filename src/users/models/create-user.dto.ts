import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUserAlreadyExist } from 'src/common/decorators/Is-user-already-exist.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsUserAlreadyExist({ message: '$value already exist' })
  email: string;

  @IsUserAlreadyExist({ message: '$value already exist' })
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
