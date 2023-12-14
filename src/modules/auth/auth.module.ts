import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Module
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/modules/user/user.module';
import { ConfirmationCodeModule } from '@/modules/confirmation-code/confirmation-code.module';
import { PassportModule } from '@nestjs/passport';

// Service
import { AuthService } from '@/modules/auth/auth.service';
import { UserService } from '@/modules/user/user.service';
import { ConfirmationCodeService } from '@/modules/confirmation-code/confirmation-code.service';

// Controller
import { AuthController } from '@/modules/auth/auth.controller';

// Entity
import { User } from '@/modules/user/user.entity';
import { ConfirmationCode } from '@/modules/confirmation-code/confirmation-code.entity';

import { LocalStrategy } from '@/modules/auth/passport/strategies/local.strategy';
import { JwtStrategy } from '@/modules/auth/passport/strategies/jwt.strategy';

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
