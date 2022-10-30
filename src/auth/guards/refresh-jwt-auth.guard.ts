import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Authentication } from 'src/common/enum/auth.enum';
import {
  UnauthorizedTokenExpiredException,
  UnauthorizedTokenInvalidSignatureException,
} from 'src/exceptions/jwt.exception';

@Injectable()
export class RefreshJWTAuthGuard extends AuthGuard(Authentication.REFRESH_JWT) {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedTokenExpiredException();
    } else if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedTokenInvalidSignatureException();
    }
    return super.handleRequest(err, user, info, context);
  }
}
