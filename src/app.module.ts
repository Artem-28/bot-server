import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';

// Configuration
import configuration from './config/configuration';
import jwt from './config/jwt';
import typeorm from './config/typeorm';
// Providers
import { AllExceptionFilter } from './base/filters/all-exception.filter';
import { ResponseInterceptor } from './base/interceptors/response.interceptor';
// Modules
import { ConfirmationCodeModule } from './modules/confirmation-code/confirmation-code.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { ScriptModule } from './modules/script/script.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, typeorm, jwt],
      isGlobal: true, // Включение\отключение глобальной обрасти для конфига .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    ConfirmationCodeModule,
    AuthModule,
    UserModule,
    ProjectModule,
    ScriptModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
