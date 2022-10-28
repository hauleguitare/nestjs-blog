import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('profile')
export class ProfileEntity {
  @PrimaryColumn({ type: 'char', length: 26 })
  uid: string;

  @Column({ type: 'varchar', default: '' })
  photoURL: string;

  @Column({ type: 'varchar', default: '' })
  bannerURL: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  bio: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @OneToOne(() => UserEntity, (User) => User.profile)
  user: UserEntity;

  constructor(uid: string, firstName: string, lastName: string) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
