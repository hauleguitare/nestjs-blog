import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { NotFoundEntityException } from 'src/exceptions/entity.exception';
import { IResponsePostStatus } from 'src/status/reponse-status.interface';
import { ReponseStatusSuccess } from 'src/status/response-status';
import { TagService } from 'src/tags/tag.service';
import { UserService } from 'src/users/user.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './models/create-post.dto';
import { UpdatePostDto } from './models/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return this.postRepo.find();
  }

  async findById(postId: number): Promise<PostEntity> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
      relations: {
        tags: true,
      },
    });
    if (!post) {
      throw new NotFoundEntityException('posts', postId.toString());
    }
    return post;
  }

  async getContent(postId: number): Promise<string> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundEntityException('posts', postId.toString());
    }
    return post.content;
  }

  async createPost(createPostDto: CreatePostDto): Promise<IResponsePostStatus> {
    const { title, content, author, tags } = createPostDto;
    const user = await this.userService.findById(author);
    if (!user) {
      throw new BadRequestException();
    }
    const listTag = await Promise.all(
      tags.map(async (value) => {
        return this.tagService.findById(value);
      }),
    );

    const post = this.postRepo.create({
      title,
      content,
      author: user,
      tags: listTag,
    });
    const _ = await this.postRepo.save(post);
    return ReponseStatusSuccess();
  }

  async updatePost(
    postId: number,
    data: UpdatePostDto,
  ): Promise<IResponsePostStatus> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundEntityException('posts', postId.toString());
    }
    const { tags, ...other } = data;
    const listTag = await Promise.all(
      tags.map(async (value) => {
        return this.tagService.findById(value);
      }),
    );
    const updatePost = Object.assign(post, {
      ...other,
      tags: listTag,
    });
    await this.postRepo.save(updatePost);
    // const result = await this.postRepo.update(post, {
    //   ...other,
    //   tags: listTag,
    // });

    return ReponseStatusSuccess();
  }
}
