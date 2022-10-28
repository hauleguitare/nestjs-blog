import {
  Exclude,
  Expose,
  plainToClass,
  Transform,
  Type,
} from 'class-transformer';
import { ProfileEntity } from 'src/entities/profile.entity';
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

  @Type(() => ProfileEntity)
  @Transform(({ value }) => plainToClass(ProfileDto, value))
  profile: ProfileDto;
  roles: RoleEntity[];
}
