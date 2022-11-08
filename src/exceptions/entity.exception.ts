import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundEntityException extends HttpException {
  constructor(path: string, target: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `${path}/not-found`,
        error: `NotFound`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
