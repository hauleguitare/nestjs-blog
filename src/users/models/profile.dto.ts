import { Exclude, Expose } from 'class-transformer';

export class ProfileDto {
  constructor(props: any) {
    Object.assign(this, props);
  }

  @Exclude()
  uid: string;

  firstName: string;
  lastName: string;
  photoURL: string;
  bannerURL: string;
  bio: string;
}
