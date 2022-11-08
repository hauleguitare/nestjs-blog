import { Role } from 'src/common/enum/role.enum';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class RoleEntity {
  constructor() {
    this.id = 0;
    (this.name = Role.MEMBER), (this.isAdmin = false);
    this.isModerate = false;
  }

  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: Role,
    default: 'member',
  })
  name: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'boolean', default: false })
  isModerate: boolean;
}
