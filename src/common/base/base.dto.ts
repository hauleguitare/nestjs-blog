import { Transform, Type } from 'class-transformer';
import { UserDto } from 'src/users/models/user.dto';

export class BaseDto {
  constructor(props: any) {
    Object.assign(this, props);
  }
  id: number;

  @Type(() => Date)
  @Transform(({ value }) => Math.floor(value.getTime() / 1000))
  createAt: number;

  @Type(() => Date)
  @Transform(({ value }) => {
    if (value !== null) {
      return Math.floor(value.getTime() / 1000);
    }
    return null;
  })
  updateAt: number;
  @Type(() => UserDto)
  author?: UserDto;
}
