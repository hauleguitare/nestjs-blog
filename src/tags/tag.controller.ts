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
import { CreateTagDto } from './models/create-tag-dto';
import { UpdateTagDto } from './models/update-tag-dto';
import { TagService } from './tag.service';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(@Query('page') page: string) {
    const queryOption: IQueryOptions = {
      page: Number(page) || 1,
    };
    return this.tagService.findAll(queryOption);
  }

  @Get(':tagId/latest')
  findPostLatest(@Param('tagId', ParseIntPipe) tagId: number) {
    return this.tagService.findPostLatest(tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':tagId')
  updateTag(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.updateTag(tagId, updateTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':tagId')
  deleteTag(@Param('tagId', ParseIntPipe) tagId: number) {
    return this.tagService.deleteTag(tagId);
  }
}
