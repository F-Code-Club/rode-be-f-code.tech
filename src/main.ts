import { RodeValidationPipe } from '@etc/rode-validation.pipe';
import { LogService } from '@logger/logger.service';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from 'sockets/socket-io.adapter';
import { AppModule } from './app.module';
import RodeConfig from './etc/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  const config = new DocumentBuilder()
    .setTitle('RODE API')
    .setDescription('The RODE API description')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  
  SwaggerModule.setup('swagger-ui', app, document);

  app.useGlobalPipes(new RodeValidationPipe());

  app.enableCors();

  app.useWebSocketAdapter(
    new SocketIoAdapter(app, await app.resolve(LogService)),
  );
  app.enableShutdownHooks();

  await app.listen(RodeConfig.PORT);
}
bootstrap();
