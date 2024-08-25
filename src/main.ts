import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EnvConstants, getBrokersFromPorts } from './utils/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get<ConfigService>(ConfigService);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: getBrokersFromPorts(
          config.getOrThrow<string>('KAFKA_HOST'),
          config.get<string>(EnvConstants.MESSAGE_QUEUE_PORTS),
        ),
      },
      consumer: {
        groupId: config.getOrThrow<string>(EnvConstants.MESSAGE_QUEUE_GROUP_ID),
      },
    },
  });
  app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.get<number>('PORT') || 3000);
}
bootstrap();
