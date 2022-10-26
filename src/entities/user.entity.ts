import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { RoleEntity } from './role.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({
    type: 'char',
    length: 26,
  })
  uid: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 65,
  })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ select: false })
  passwordSalt: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastLogin: Date;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  @JoinColumn()
  profile: ProfileEntity;

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'user_role' })
  roles: RoleEntity[];
}
