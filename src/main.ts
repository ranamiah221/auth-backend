import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
   
  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('Auth system with signup, login, OTP verification, and password reset')
    .setVersion('1.0')
    .addBearerAuth({
      type:'http', scheme:'bearer', bearerFormat:'JWT'
    }, 'JWT-auth') // so you can authorize with JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
}
bootstrap();

