import { IProfile } from './profile.interface';

export interface IUser {
  uid: string;
  username: string;
  email: string;
  createAt: Date;
  lastLogin: Date;
  profile: IProfile;
}
