import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Включение\отключение глобальной обрасти для конфига .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DATABASE'),
        host: config.get<string>('MYSQL_DATABASE_HOST'),
        port: config.get<number>('MYSQL_DATABASE_PORT'),
        entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        logging: true,
        synchronize: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
