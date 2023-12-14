import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module
import { MailingModule } from '@/modules/mailing/mailing.module';

// Controller
import { ConfirmationCodeController } from '@/modules/confirmation-code/confirmation-code.controller';

// Service
import { ConfirmationCodeService } from '@/modules/confirmation-code/confirmation-code.service';
import { MailingService } from '@/modules/mailing/mailing.service';

// Entity
import { ConfirmationCode } from '@/modules/confirmation-code/confirmation-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfirmationCode]), MailingModule],
  controllers: [ConfirmationCodeController],
  providers: [ConfirmationCodeService, MailingService],
})
export class ConfirmationCodeModule {}
