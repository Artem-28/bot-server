import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { ConfirmationCodesModule } from '../confirmation-codes/confirmation-codes.module';
import { ConfirmationCodesService } from '../confirmation-codes/confirmation-codes.service';
import { ConfirmationCodes } from '../confirmation-codes/confirmation-codes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([ConfirmationCodes]),
    UsersModule,
    ConfirmationCodesModule,
  ],
  providers: [AuthService, UsersService, ConfirmationCodesService],
  controllers: [AuthController],
})
export class AuthModule {}
