import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Get, Req, Res,
} from '@nestjs/common';
import { RegistrationUsersDto } from './dto/registration-users.dto';
import { AuthService } from './auth.service';
import { AuthLocalGuard } from './passport/guards/auth-local.guard';
import { AuthJwtGuard } from './passport/guards/auth-jwt.guard';

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
  public async login(@Request() req) {
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
