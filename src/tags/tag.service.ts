import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from 'src/entities/tag.entity';
import { NotFoundEntityException } from 'src/exceptions/entity.exception';
import { IResponsePostStatus } from 'src/status/reponse-status.interface';
import { ReponseStatusSuccess } from 'src/status/response-status';
import { Repository } from 'typeorm';
import { CreateTagDto } from './models/create-tag-dto';
import { UpdateTagDto } from './models/update-tag-dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepo: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return this.tagRepo.find();
  }

  async findById(tagId: number): Promise<TagEntity> {
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
    return tag;
  }

  async findTag(tagName: string): Promise<TagEntity | null> {
    return this.tagRepo.findOne({
      where: {
        name: tagName,
      },
    });
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
}
