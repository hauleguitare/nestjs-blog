import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsArray()
  @IsOptional()
  tags?: number[];
}
