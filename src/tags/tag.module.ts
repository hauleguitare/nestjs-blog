import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'src/entities/tag.entity';
import { PostModule } from 'src/posts/post.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagEntity]),
    forwardRef(() => PostModule),
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
