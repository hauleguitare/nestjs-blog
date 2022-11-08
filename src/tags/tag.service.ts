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
import { TagEntity } from 'src/entities/tag.entity';
import { NotFoundEntityException } from 'src/exceptions/entity.exception';
import { PostService } from 'src/posts/post.service';
import { IResponsePostStatus } from 'src/status/reponse-status.interface';
import { ReponseStatusSuccess } from 'src/status/response-status';
import { Repository } from 'typeorm';
import { CreateTagDto } from './models/create-tag-dto';
import { TagDto } from './models/tag.dto';
import { UpdateTagDto } from './models/update-tag-dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepo: Repository<TagEntity>,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async findAll(queryOption: IQueryOptions): Promise<Paginate<TagDto>> {
    const skip = Paginate.calcSkip(queryOption.page);
    const [tags, total_results] = await this.tagRepo.findAndCount({
      skip: skip,
      take: Paginate.TAKE, //?Using to pagination
      order: {
        id: 'asc',
      },
      relations: ['posts'],
    });
    const results = tags.map((tag) => {
      const tagDto = plainToInstance(TagDto, tag);
      tagDto.total_posts = tag.posts.length;
      return tagDto;
    });
    return new Paginate({
      results,
      total_results,
      queryOption,
    });
  }

  async findById(tagId: number): Promise<TagDto> {
    const tag = await this.tagRepo.findOne({
      where: {
        id: tagId,
      },
      relations: {
        posts: true,
      },
    });
    if (!tag) {
      throw new NotFoundEntityException('tags', tagId.toString());
    }
    return plainToInstance(TagDto, tag);
  }

  async findTag(tagName: string): Promise<TagEntity | null> {
    return this.tagRepo.findOne({
      where: {
        name: tagName,
      },
    });
  }

  async findPostLatest(tagId: number): Promise<any> {
    const post = await this.postService.findPostLatestByTagId(tagId);
    return post;
  }

  async createTag(createTagDto: CreateTagDto): Promise<IResponsePostStatus> {
    const tagExist = await this.findTag(createTagDto.name);
    if (tagExist) {
      throw new BadRequestException();
    }
    const newTag = this.tagRepo.create(createTagDto);
    const _ = await this.tagRepo.save(newTag);
    return ReponseStatusSuccess();
  }

  async updateTag(
    tagId: number,
    updateTagDto: UpdateTagDto,
  ): Promise<IResponsePostStatus> {
    const tag = await this.tagRepo.findOne({
      where: {
        id: tagId,
      },
    });
    if (!tag) {
      throw new NotFoundEntityException('tags', updateTagDto.name);
    }
    const updateTag = Object.assign(tag, updateTagDto);
    const _ = await this.tagRepo.save(updateTag);
    return ReponseStatusSuccess();
  }

  async deleteTag(tagId: number): Promise<TagEntity> {
    const deleteTag = await this.tagRepo.findOne({
      where: {
        id: tagId,
      },
    });
    if (!deleteTag) {
      throw new NotFoundEntityException('tags', tagId.toString());
    }
    await this.tagRepo.delete(deleteTag);
    return deleteTag;
  }
}
