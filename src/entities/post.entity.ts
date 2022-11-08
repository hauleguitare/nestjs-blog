import { BaseEntity } from 'src/common/base/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Entity('post')
export class PostEntity extends BaseEntity {
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
}
