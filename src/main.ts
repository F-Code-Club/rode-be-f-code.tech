import { RodeValidationPipe } from '@etc/rode-validation.pipe';
import { LogService } from '@logger/logger.service';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from 'sockets/socket-io.adapter';
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

  app.useWebSocketAdapter(
    new SocketIoAdapter(app, await app.resolve(LogService)),
  );

  await app.listen(RodeConfig.PORT);
}
bootstrap();
