import { Exclude, Transform, Type } from 'class-transformer';
import { RoleEntity } from 'src/entities/role.entity';

export class UserDto {
  constructor(props: any) {
    Object.assign(this, props);
  }
  uid: string;
  username: string;
  email: string;
  @Exclude()
  passwordHash: string;
  @Exclude()
  passwordSalt: string;

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
  lastLogin: number;

  photoURL: string;
  bannerURL: string;
  bio: string;
  firstName: string;
  lastName: string;

  roles: RoleEntity[];
}
