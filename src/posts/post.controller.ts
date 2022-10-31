import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostEntity } from 'src/entities/post.entity';
import { CreatePostDto } from './models/create-post.dto';
import { UpdatePostDto } from './models/update-post.dto';
import { PostService } from './post.service';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Patch(':postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(postId, updatePostDto);
  }

  @Get(':postId')
  async findPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    return this.postService.findById(postId);
  }

  @Get(':postId/content')
  async getContent(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<string> {
    return this.postService.getContent(postId);
  }
}
