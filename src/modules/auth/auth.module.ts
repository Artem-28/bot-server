import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { ConfirmationCodeModule } from '../confirmation-code/confirmation-code.module';
import { ConfirmationCodeService } from '../confirmation-code/confirmation-code.service';
import { ConfirmationCode } from '../confirmation-code/confirmation-code.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ConfirmationCode]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => config.get('jwt'),
    }),
    UserModule,
    ConfirmationCodeModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    UserService,
    ConfirmationCodeService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
