import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';
import { BaseEntity } from 'src/common/base/base.entity';

@Entity('comment')
@Tree('closure-table')
export class CommentEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @ManyToOne(() => PostEntity)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @TreeChildren()
  children: CommentEntity[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: CommentEntity;
}
