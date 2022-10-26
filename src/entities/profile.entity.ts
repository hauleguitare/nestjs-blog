import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('profile')
export class ProfileEntity {
  @PrimaryColumn({ type: 'char', length: 26 })
  uid: string;

  @Column({ type: 'varchar' })
  photoURL: string;

  @Column({ type: 'varchar' })
  bannerURL: string;

  @Column({ type: 'varchar', length: 255 })
  bio: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @OneToOne(() => UserEntity, (User) => User.profile)
  user: UserEntity;
}
