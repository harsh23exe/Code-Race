import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use environment variable for CORS origin, fallback to localhost for development
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';

  app.enableCors({
    origin: corsOrigin,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

