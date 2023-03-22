import { RodeValidationPipe } from '@etc/rode-validation.pipe';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import { AuthenticatedSocketAdapter } from 'sockets/authenticated-socket.adapter';
import { AppModule } from './app.module';
import RodeConfig from './etc/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('RODE API')
    .setDescription('The RODE API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new RodeValidationPipe());

  app.enableCors();

  //app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));

  await app.listen(RodeConfig.PORT);
}
bootstrap();
