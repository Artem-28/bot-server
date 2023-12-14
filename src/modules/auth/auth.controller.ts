import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  Post,
  UseGuards,
  UseInterceptors,
  Get,
  Req,
} from '@nestjs/common';

// Guards
import { AuthLocalGuard } from '@/modules/auth/passport/guards/auth-local.guard';
import { AuthJwtGuard } from '@/modules/auth/passport/guards/auth-jwt.guard';

// Service
import { AuthService } from '@/modules/auth/auth.service';

// Entity

// Types
import { RegistrationUsersDto } from '@/modules/auth/dto/registration-users.dto';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('registration')
  @UseInterceptors(ClassSerializerInterceptor)
  public async registration(@Body() body: RegistrationUsersDto) {
    try {
      return await this.authService.registrationUser(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @UseGuards(AuthLocalGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  public async login(@Req() req) {
    try {
      return this.authService.loginUser(req.user);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @UseGuards(AuthJwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
  public async user(@Req() req) {
    try {
      return req.user;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
