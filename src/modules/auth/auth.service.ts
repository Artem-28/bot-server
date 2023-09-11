import { HttpException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { ConfirmationCodesService } from '../confirmation-codes/confirmation-codes.service';

import { RegistrationUserDto } from './dto/registration-user.dto';
import { ConfirmationTypeEnum } from '../../base/enum/confirmation/confirmation-type.enum';
import { ExceptionTypeEnum } from '../../base/enum/exception/exception-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _confirmationCodesService: ConfirmationCodesService,
  ) {}

  public async registrationUser(payload: RegistrationUserDto) {
    const { email, code, password, licenseAgreement } = payload;

    // Проверка приняты ли условия пользования
    if (!licenseAgreement) {
      const error = {
        message: 'registration.license_agreement',
        type: ExceptionTypeEnum.TYPE_GLOBAL,
      };
      throw new HttpException(error, 500);
    }

    const checkCodeData = {
      email,
      code,
      type: ConfirmationTypeEnum.TYPE_REGISTRATION,
    };
    // Валидация кода подтверждения
    await this._confirmationCodesService.checkCode(checkCodeData, []);

    // Установка необходимых полей, установка верифиации email
    const userData = {
      email,
      password,
      licenseAgreement,
      emailVerifiedAt: new Date(),
    };
    // Создание пользователя
    return await this._usersService.create(userData);
  }
}
