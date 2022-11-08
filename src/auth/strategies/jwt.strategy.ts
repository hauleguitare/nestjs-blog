import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Authentication } from 'src/common/enum/auth.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  Authentication.JWT,
) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SERCET_KEY'),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
