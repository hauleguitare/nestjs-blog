import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { TagModule } from 'src/tags/tag.module';
import { UserModule } from 'src/users/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), UserModule, TagModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
