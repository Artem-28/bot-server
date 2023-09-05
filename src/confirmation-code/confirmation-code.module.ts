import { Module } from '@nestjs/common';
import { ConfirmationCodeController } from './confirmation-code.controller';
import { ConfirmationCodeService } from './confirmation-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfirmationCodeSchema } from './confirmation-code.schema';
import { MailingModule } from '../mailing/mailing.module';
import { MailingService } from '../mailing/mailing.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfirmationCodeSchema]), MailingModule],
  controllers: [ConfirmationCodeController],
  providers: [ConfirmationCodeService, MailingService],
})
export class ConfirmationCodeModule {}
