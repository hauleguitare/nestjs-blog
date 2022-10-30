import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

export class UnauthorizedTokenExpiredException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'auth/token-expired',
        error: 'Token expired',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UnauthorizedTokenInvalidSignatureException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'auth/token-invalid-signature',
        error: 'Token invalid signature',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
