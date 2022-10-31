import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 600 })
  title: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column({ type: 'text' })
  content: string;

  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  @JoinTable({ name: 'post_tag' })
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @BeforeInsert()
  private createTime() {
    this.createAt = new Date();
  }
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @BeforeUpdate()
  private updateTime() {
    this.updateAt = new Date();
  }
  @Column({ type: 'timestamptz', nullable: true, default: null })
  updateAt: Date;
}
