import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTagDto } from './models/create-tag-dto';
import { UpdateTagDto } from './models/update-tag-dto';
import { TagService } from './tag.service';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':tagId')
  findTag(@Param('tagId', ParseIntPipe) tagId: number) {
    return this.tagService.findById(tagId);
  }

  @Patch(':tagId')
  updateTag(
    @Param('tagId', ParseIntPipe) tagId: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.updateTag(tagId, updateTagDto);
  }
}
