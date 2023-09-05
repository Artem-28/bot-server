import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = await app.get<ConfigService>(ConfigService);
  const port = config.get<number>('API_PORT');
  await app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
}
bootstrap();
