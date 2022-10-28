import { CreateUserDto } from 'src/users/models/create-user.dto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { ProfileEntity } from './profile.entity';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  constructor() {
    this.uid = ulid();
  }

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

  @Column()
  passwordHash: string;

  @Column()
  passwordSalt: string;

  @CreateDateColumn()
  createAt: Date;

  @BeforeInsert()
  private updateLoginTime() {
    this.lastLogin = new Date();
  }
  @Column({ type: 'timestamptz', nullable: true })
  lastLogin: Date;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: ProfileEntity;

  @ManyToMany(() => RoleEntity, { cascade: true })
  @JoinTable({ name: 'user_role' }) //! ERROR CANNOT REMOVE IF USER DELETE
  roles: RoleEntity[];
}
