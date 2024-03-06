import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Configuration
import configuration from '@/config/configuration';
import jwt from '@/config/jwt';

// Providers
import { ResponseInterceptor } from '@/base/interceptors/response.interceptor';
import { AllExceptionFilter } from '@/base/filters/all-exception.filter';

// Modules
import { ConfirmationCodeModule } from '@/modules/confirmation-code/confirmation-code.module';
import { AuthModule } from '@/modules/auth/auth.module';
// import { UserModule } from '@/modules/user/user.module';
import { ProjectModule } from '@/modules/project/project.module';
import { ScriptModule } from '@/modules/script/script.module';
import { FakeDataModule } from '@/modules/fake-data/fake-data.module';
import { ProjectSubscriberModule } from '@/modules/project-subscriber/project-subscriber.module';
import { CheckPermissionModule } from '@/modules/check-permission/check-permission.module';
import { DropdownOptionModule } from './modules/dropdown-option/dropdown-option.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerModule } from './modules/answer/answer.module';
import { PermissionModule } from './modules/permission/permission.module';
import { CheckEntityModule } from './modules/check-entity/check-entity.module';
import { TypeormModule, UserModule } from '@/app-services';

@Module({
  imports: [
    TypeormModule,
    UserModule,
    ConfigModule.forRoot({
      load: [configuration, jwt],
      isGlobal: true, // Включение\отключение глобальной обрасти для конфига .env
    }),
    ConfirmationCodeModule,
    AuthModule,
    ProjectModule,
    ScriptModule,
    FakeDataModule,
    ProjectSubscriberModule,
    CheckPermissionModule,
    DropdownOptionModule,
    QuestionModule,
    AnswerModule,
    PermissionModule,
    CheckEntityModule,
  ],
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
