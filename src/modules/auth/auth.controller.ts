import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('registration')
  @UseInterceptors(ClassSerializerInterceptor)
  public async registration(@Body() body: RegistrationUserDto) {
    try {
      return await this.authService.registrationUser(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
