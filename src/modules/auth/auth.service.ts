import { HttpException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfirmationCodeService } from '../confirmation-code/confirmation-code.service';

import { RegistrationUsersDto } from './dto/registration-users.dto';
import { ConfirmationTypeEnum } from '../../base/enum/confirmation/confirmation-type.enum';
import { ExceptionTypeEnum } from '../../base/enum/exception/exception-type.enum';
import { User } from '../user/user.entity';
import { LoginUsersDto } from './dto/login-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _confirmationCodeService: ConfirmationCodeService,
    private readonly _jwtService: JwtService,
  ) {}

  // Проверка пароля пользователя
  public async checkUser(dto: LoginUsersDto) {
    const user = await this._userService.getOneUser({
      filter: { field: 'email', value: dto.email },
    });
    if (!user) return null;
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) return null;
    return user;
  }

  public async registrationUser(payload: RegistrationUsersDto): Promise<User> {
    const { email, code, licenseAgreement } = payload;

    // Проверка приняты ли условия пользования
    if (!licenseAgreement) {
      const error = {
        message: 'registration.license_agreement',
        type: ExceptionTypeEnum.TYPE_GLOBAL,
      };
      throw new HttpException(error, 500);
    }
    // Валидация кода подтверждения
    await this._confirmationCodeService.checkCode(
      {
        email,
        code,
        type: ConfirmationTypeEnum.TYPE_REGISTRATION,
      },
      ['live', 'confirm'],
    );
    const password = await bcrypt.hash(payload.password, 10);
    // Создание пользователя
    const user = await this._userService.create({
      email,
      password,
      licenseAgreement,
      emailVerifiedAt: new Date(),
    });

    await this._confirmationCodeService.remove({
      email,
      type: ConfirmationTypeEnum.TYPE_REGISTRATION,
    });
    return user;
  }

  // Авторизовать пользователя
  public loginUser(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this._jwtService.sign(payload),
      typeToken: 'Bearer',
      user,
    };
  }
}
