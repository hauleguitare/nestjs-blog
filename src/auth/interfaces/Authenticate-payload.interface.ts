import { UserDto } from 'src/users/models/user.dto';

export interface IAuthenticatePayload extends UserDto {
  sub: string;
}
