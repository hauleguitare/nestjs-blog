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

@Entity('comment')
@Tree('closure-table')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @BeforeInsert()
  private createTime = () => {
    this.createAt = new Date();
  };

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @BeforeUpdate()
  private updateTime = () => {
    this.updateAt = new Date();
  };
  @Column({ type: 'timestamptz', nullable: true, default: null })
  updateAt: Date;
}
