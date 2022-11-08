import { Exclude } from 'class-transformer';
import { PostDto } from 'src/posts/models/post.dto';

export class TagDto {
  id: number;
  name: string;
  @Exclude()
  posts: PostDto[];
  total_posts: number;
}
