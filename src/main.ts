import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // JWT Secret Strength Validation
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error(
      '[SECURITY] JWT_SECRET is too weak or missing. ' +
        'Must be at least 32 characters long. Server startup aborted.',
    );
  }

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://studentswap-ten.vercel.app',
    ],
  });

  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //  cho phép tự động chuyển đổi kiểu dữ liệu
      transformOptions: {
        enableImplicitConversion: true, //  tự động đổi "200" -> 200
      },
      exceptionFactory: (errors) => {
        const result = errors.map((err) => ({
          field: err.property,
          messages: Object.values(err.constraints),
        }));
        return new BadRequestException(result);
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
