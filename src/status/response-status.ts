import { HttpStatus } from '@nestjs/common';
import { IResponsePostStatus } from './reponse-status.interface';

export function ReponseStatusSuccess(): IResponsePostStatus {
  return {
    statusCode: HttpStatus.CREATED,
    message: 'Success',
  };
}
