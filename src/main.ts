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
    .setDescription('The RODE API For Rode Battle Management')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger-ui', app, document);

  app.useGlobalPipes(new RodeValidationPipe());

  const originList: string[] = ['http://localhost:3000'];
  if (RodeConfig.ORIGIN_DOMAIN.length)
    originList.push(RodeConfig.ORIGIN_DOMAIN);
  const header = [
    'Accept',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Origin',
    'Authorization',
    'Content-Type',
    'Origin',
    'X-Requested-With',
  ];
  app.enableCors({
    origin: originList,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: header,
    exposedHeaders: header,
    credentials: true,
  });

  app.useWebSocketAdapter(
    new SocketIoAdapter(app, await app.resolve(LogService)),
  );
  app.enableShutdownHooks();

  await app.listen(RodeConfig.PORT);
}
bootstrap();
