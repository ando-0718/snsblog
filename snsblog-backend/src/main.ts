import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'), // Next.jsのURL
    credentials: true,               // Cookie送信を許可
  });
  
  await app.listen(configService.get<number>('PORT') ?? 4000);
}
bootstrap();