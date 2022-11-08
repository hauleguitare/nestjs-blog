import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Paginate } from 'src/common/dto/paginate.dto';
import { IQueryOptions } from 'src/common/interfaces/query-options.interface';
import { PostEntity } from 'src/entities/post.entity';
import { NotFoundEntityException } from 'src/exceptions/entity.exception';
import { IResponsePostStatus } from 'src/status/reponse-status.interface';
import { ReponseStatusSuccess } from 'src/status/response-status';
import { TagService } from 'src/tags/tag.service';
import { UserService } from 'src/users/user.service';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './models/create-post.dto';
import { PostDto } from './models/post.dto';
import { UpdatePostDto } from './models/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
  ) {}

  async findAll(queryOption: IQueryOptions): Promise<Paginate<PostDto>> {
    const skip = Paginate.calcSkip(queryOption.page);
    const [posts, total_results] = await this.postRepo.findAndCount({
      relations: ['tags'],
      skip: skip,
      take: Paginate.TAKE,
    });
    const results = this.convertDto(posts);
    return new Paginate({
      results,
      total_results,
      queryOption,
    });
  }

  async findById(postId: number): Promise<PostEntity> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
      relations: ['tags'],
    });
    if (!post) {
      throw new NotFoundEntityException('posts', postId.toString());
    }
    return post;
  }

  async findFilterByTag(
    queryOption: IQueryOptions,
  ): Promise<Paginate<PostDto>> {
    const skip = Paginate.calcSkip(queryOption.page);
    const [posts, total_results] = await this.postRepo.findAndCount({
      relations: ['tags', 'author'],
      skip: skip,
      take: Paginate.TAKE,
      where: {
        tags: {
          id: In(queryOption.tags),
        },
      },
      order: {
        createAt: 'DESC',
      },
    });
    const results = this.convertDto(posts);
    return new Paginate({
      results,
      total_results,
      queryOption,
    });
  }

  async findPostLatestByTagId(tagId: number): Promise<PostDto> {
    const post = await this.postRepo.findOne({
      relations: ['tags'],
      where: {
        tags: {
          id: tagId,
        },
      },
      order: {
        createAt: 'DESC',
      },
    });
    return plainToInstance(PostDto, post);
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
    // If user don't change tag category
    if (!tags) {
      await this.postRepo.update(postId, other);
      return ReponseStatusSuccess();
    }

    // If user change tag category, because typeorm cannot change value many-to-many with method update()
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
    return ReponseStatusSuccess();
  }

  async deletePost(postId: number): Promise<PostDto> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundEntityException('post', postId.toString());
    }
    const deleted = await this.postRepo.remove(post);
    return plainToInstance(PostDto, deleted);
  }

  private convertDto(data: PostEntity[]) {
    const results = data.map((post) => plainToInstance(PostDto, post));
    return results;
  }
}
