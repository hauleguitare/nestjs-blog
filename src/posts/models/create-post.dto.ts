import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CommentEntity } from 'src/entities/comment.entity';
import { PostEntity } from 'src/entities/post.entity';
import { TagEntity } from 'src/entities/tag.entity';
import { UserEntity } from 'src/entities/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  author: string;
  @IsNotEmpty()
  content: string;
  @IsArray()
  tags: number[];
}
