import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Authentication } from 'src/common/enum/auth.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(Authentication.LOCAL) {}
