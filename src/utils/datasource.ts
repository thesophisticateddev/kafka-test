import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class Datasource implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const user = this.configService.getOrThrow<string>('DATABASE_USER');
    const password = this.configService.getOrThrow<string>('DATABASE_PASSWORD');
    const host = this.configService.getOrThrow<string>('DATABASE_HOST');
    const port = this.configService.getOrThrow<string>('DATABASE_PORT');
    const dbUrl = `mongodb://${user}:${password}@${host}:${port}/`;
    return {
      uri: dbUrl,
      dbName: this.configService.getOrThrow<string>('DATABASE_NAME'),
    };
  }
}
