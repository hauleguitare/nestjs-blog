import { Transform, Type } from 'class-transformer';
import { BaseDto } from 'src/common/base/base.dto';
import { TagEntity } from 'src/entities/tag.entity';
import { UserDto } from 'src/users/models/user.dto';

export class PostDto extends BaseDto {
  constructor(props: any) {
    super(props);
  }
  title: string;
  content: string;
  tags: TagEntity[];
}
