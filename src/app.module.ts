import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IsUserAlreadyExistConstraint } from './common/decorators/Is-user-already-exist.decorator';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, IsUserAlreadyExistConstraint],
})
export class AppModule {}
