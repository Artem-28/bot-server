import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { RegistrationUserDto } from '../users/dto/registration-user.dto';

@Controller('auth')
export class AuthController {
  @Post('registration')
  public async registration(@Body() body: RegistrationUserDto) {
    try {
      return body;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
