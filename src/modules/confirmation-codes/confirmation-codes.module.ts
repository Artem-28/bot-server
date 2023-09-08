import { Module } from '@nestjs/common';
import { ConfirmationCodesController } from './confirmation-codes.controller';
import { ConfirmationCodesService } from './confirmation-codes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingModule } from '../mailing/mailing.module';
import { MailingService } from '../mailing/mailing.service';
import { ConfirmationCodes } from './confirmation-codes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfirmationCodes]), MailingModule],
  controllers: [ConfirmationCodesController],
  providers: [ConfirmationCodesService, MailingService],
})
export class ConfirmationCodesModule {}
