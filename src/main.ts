import { NestFactory } from '@nestjs/core';
import { AppModule } from './nestjs/module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(9001);
}
bootstrap();
