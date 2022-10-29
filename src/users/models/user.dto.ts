import {
  Exclude,
  Expose,
  plainToClass,
  Transform,
  Type,
} from 'class-transformer';
import { RoleEntity } from 'src/entities/role.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileDto } from './profile.dto';

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
  createAt: Date;

  @Type(() => Date)
  @Transform(({ value }) => Math.floor(value.getTime() / 1000))
  lastLogin: number;
  
  photoURL: string;
  bannerURL: string;
  bio: string;
  firstName: string;
  lastName: string;

  roles: RoleEntity[];
}
