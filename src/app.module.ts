import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from './config/configuration';
import typeorm from './config/typeorm';

import { ConfirmationCodeModule } from './confirmation-code/confirmation-code.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, typeorm],
      isGlobal: true, // Включение\отключение глобальной обрасти для конфига .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    ConfirmationCodeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
