import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfirmationCodeSchema } from './confirmation-code.schema';
import ConfirmationCode from './confirmation-code';
import { CreateConfirmationCodeDto } from './dto/create-confirmation-code.dto';

import randomInteger from '../helpers/randomInteger';
import { MailingService } from '../mailing/mailing.service';
import { EnumConfirmation } from '../enum/EnumConfirmation';

@Injectable()
export class ConfirmationCodeService {
  constructor(
    @InjectRepository(ConfirmationCodeSchema) // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private readonly confirmationCodesRepository: Repository<ConfirmationCode>,
    private readonly mailingService: MailingService,
  ) {}

  private generateCode(length: number, separator: string = ''): string {
    const numbers = [];
    for (let i = 0; i < length; i++) {
      numbers.push(randomInteger(0, 9));
    }
    return numbers.join(separator);
  }

  private async sendRegistrationConfirmCode(
    payload: CreateConfirmationCodeDto,
  ) {
    const confirmationCode = await this.create(payload);
    const options = {
      to: payload.email,
      subject: 'Подтверждение регистрации',
      template: `./confirmation/${payload.type}`,
      context: { code: confirmationCode },
    };
    await this.mailingService.sendMessage(options);
  }

  public async create(payload: CreateConfirmationCodeDto) {
    const data = {
      ...payload,
      code: this.generateCode(6),
    };
    return await this.confirmationCodesRepository.upsert(data, ['email']);
  }

  public async getCode(email: string) {
    return await this.confirmationCodesRepository
      .createQueryBuilder('confirmation_code')
      .where('confirmation_code.email = :email', { email })
      .getOne();
  }

  public async send(payload: CreateConfirmationCodeDto) {
    switch (payload.type) {
      case EnumConfirmation.TYPE_REGISTRATION:
        return this.sendRegistrationConfirmCode(payload);
    }
  }
}
