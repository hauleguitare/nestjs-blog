import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Authentication } from 'src/common/enum/auth.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  Authentication.LOCAL,
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'usernameOrEmail',
    });
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.authService.ValidateUser(usernameOrEmail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
