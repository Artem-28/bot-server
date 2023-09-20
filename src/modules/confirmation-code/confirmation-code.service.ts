import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateConfirmationCodeDto } from './dto/create-confirmation-code.dto';
import { CheckConfirmationCodeDto } from './dto/check-confirmation-code.dto';
import {
  IResponseCheckCode,
  IResponseSendCode,
} from './interfaces/response-code.interface';

import randomInteger from '../../base/helpers/randomInteger';
import { ConfirmationCodes } from './confirmation-code.entity';
import { ExceptionTypeEnum } from '../../base/enum/exception/exception-type.enum';
import { RemoveConfirmationCodeDto } from './dto/remove-confirmation-code.dto';

@Injectable()
export class ConfirmationCodeService {
  private readonly _codeLength: number = 6; // Длина кода символов
  private readonly _liveTimeCode: number = 360 * 1000; // Время действия кода мс.
  private readonly _delayTimeCode: number = 120 * 1000; // Вркмя задержки мс.

  constructor(
    @InjectRepository(ConfirmationCodes)
    private readonly confirmationCodesRepository: Repository<ConfirmationCodes>,
  ) {}

  // Генерация значения кода
  private _generateCode(): string {
    const numbers = [];
    for (let i = 0; i < this._codeLength; i++) {
      numbers.push(randomInteger(0, 9));
    }
    return numbers.join('');
  }

  // Проверка срока действия кода
  private _checkIsLiveCode(code: ConfirmationCodes): boolean {
    const liveTimestamp = code.updatedTimestamp + this._liveTimeCode;
    const currentTimestamp = new Date().getTime();
    return liveTimestamp > currentTimestamp;
  }

  // Проверка задержки обновления кода
  private _checkIsDelayCode(code: ConfirmationCodes): boolean {
    const delayTimestamp = code.updatedTimestamp + this._delayTimeCode;
    const currentTimestamp = new Date().getTime();
    return delayTimestamp > currentTimestamp;
  }

  // Создание нового кода подтверждения
  private async _create(
    payload: CreateConfirmationCodeDto,
  ): Promise<ConfirmationCodes> {
    const data = { ...payload, value: this._generateCode() };
    return await this.confirmationCodesRepository.save(data);
  }

  // Получение кода по типу и email
  private async _getCode(
    payload: CreateConfirmationCodeDto,
  ): Promise<ConfirmationCodes | null> {
    return await this.confirmationCodesRepository.findOneBy(payload);
  }

  // Обновление значения кода
  private async _updateValue(code: ConfirmationCodes): Promise<boolean> {
    const result = await this.confirmationCodesRepository.update(
      { id: code.id },
      { value: this._generateCode() },
    );
    return !!result.affected;
  }

  // Валидация кода
  private _validateCode(
    payload: CheckConfirmationCodeDto,
    code: ConfirmationCodes | null,
    throwException: string[] = [],
  ): IResponseCheckCode {
    const validate = {
      confirm: code && code.value === payload.code,
      live: code && this._checkIsLiveCode(code),
      delay: code && this._checkIsDelayCode(code),
    };

    if (throwException.includes('live') && !validate.live) {
      const error = {
        message: `confirm_code.validate.live`,
        type: ExceptionTypeEnum.TYPE_CONTROL_CODE,
      };
      throw new HttpException(error, 500);
    }

    if (throwException.includes('confirm') && !validate.confirm) {
      const error = {
        message: `confirm_code.validate.confirm`,
        type: ExceptionTypeEnum.TYPE_CONTROL_CODE,
      };
      throw new HttpException(error, 500);
    }

    if (throwException.includes('delay') && validate.delay) {
      const error = {
        message: `confirm_code.validate.delay`,
        type: ExceptionTypeEnum.TYPE_CONTROL_CODE,
      };
      throw new HttpException(error, 500);
    }

    return validate;
  }

  // Получение ответа для отправки на клиент
  public getResponseCode(code: ConfirmationCodes): IResponseSendCode {
    const currentTimestamp = new Date().getTime();
    const diffTimestamp = code.updatedTimestamp - currentTimestamp;
    // Остаток задержки в сек.
    const delay = Math.floor((diffTimestamp + this._delayTimeCode) / 1000);
    // Остаток действия кода в сек.
    const live = Math.floor((diffTimestamp + this._liveTimeCode) / 1000);
    const { email, type } = code;
    return { email, type, delay, live };
  }

  // Логика оздания кода подтверждения
  public async createCode(
    payload: CreateConfirmationCodeDto,
  ): Promise<ConfirmationCodes> {
    const code = await this._getCode(payload);
    // Если код не отправлялся ранее, отправляем новый код
    if (!code) {
      return await this._create(payload);
    }
    // Если код отправлялся ранее проверяем его на задержку
    this._validateCode(payload, code, ['delay']);
    // Если нет задержки то обновляем значение кода
    const success = await this._updateValue(code);
    if (!success) {
      const message = `confirm_code.update`;
      throw new HttpException(message, 500);
    }
    // Получаем обновленный код
    return await this._getCode(payload);
  }

  // Проверка кода
  public async checkCode(
    payload: CheckConfirmationCodeDto,
    throwException: string[] = [],
  ): Promise<IResponseCheckCode> {
    const { type, email } = payload;
    const code = await this._getCode({ type, email });
    return this._validateCode(payload, code, throwException);
  }

  public async remove(payload: RemoveConfirmationCodeDto) {
    return this.confirmationCodesRepository.delete(payload);
  }
}
