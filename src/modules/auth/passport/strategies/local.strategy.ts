import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@/modules/auth/auth.service';
import { ExceptionTypeEnum } from '@/base/enum/exception/exception-type.enum';
import { User } from '@/modules/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private _authService: AuthService) {
    super({ usernameField: 'email' });
  }

  public async validate(username: string, password: string): Promise<User> {
    const user = await this._authService.checkUser({ email: username, password });
    if (!user) {
      const error = {
        message: 'login.not_authorized',
        type: ExceptionTypeEnum.TYPE_CONTROL_EMAIL,
      };
      throw new HttpException(error, 500);
    }
    return user;
  }
}
