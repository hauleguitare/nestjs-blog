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
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  constructor() {
    this.uid = ulid(Math.floor(new Date().getTime() / 1000));
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

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @BeforeInsert()
  private updateLoginTime() {
    this.lastLogin = new Date();
  }
  @Column({ type: 'timestamptz', nullable: true })
  lastLogin: Date;

  @ManyToMany(() => RoleEntity, { cascade: true })
  @JoinTable({ name: 'user_role' }) //! ERROR CANNOT REMOVE IF USER DELETE
  roles: RoleEntity[];
}
