import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsModule } from './jobs/jobs.module';
import * as mongoose from 'mongoose';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const user = config.getOrThrow<string>('DATABASE_USER');
        const password = config.getOrThrow<string>('DATABASE_PASSWORD');
        const host = config.getOrThrow<string>('DATABASE_HOST');
        const port = config.getOrThrow<string>('DATABASE_PORT');
        const dbUrl = `mongodb://${user}:${password}@${host}:${port}/`;
        return {
          uri: dbUrl,
          dbName: config.getOrThrow<string>('DATABASE_NAME'),
        };
      },
      inject: [ConfigService],
    }),
    // MongooseModule.forRoot('mongodb://root:example@localhost:27017/', {
    //   dbName: 'nest',
    // }),
    KafkaModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
