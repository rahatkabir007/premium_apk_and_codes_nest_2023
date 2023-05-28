import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(8000 || 3001);
  console.log(`PREMIUM APK CODE PDF NEWSPAPER HUSTLE SERVER listening on port 8000`);
}
bootstrap();
