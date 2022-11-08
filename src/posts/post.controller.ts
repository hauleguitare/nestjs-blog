import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IQueryOptions } from 'src/common/interfaces/query-options.interface';
import { PostEntity } from 'src/entities/post.entity';
import { CreatePostDto } from './models/create-post.dto';
import { UpdatePostDto } from './models/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('tags') tagQuery: string,
  ): Promise<any> {
    const queryOption: IQueryOptions = {
      page: Number(page) || 1,
    };
    if (!tagQuery) {
      return this.postService.findAll(queryOption);
    }
    const tags = tagQuery?.split(',').map((val) => Number(val));
    queryOption.tags = tags;
    return this.postService.findFilterByTag(queryOption);
  }

  @Get()
  @Get(':postId')
  async findPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    return this.postService.findById(postId);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Patch(':postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(postId, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async deletePost(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.deletePost(postId);
  }
}
