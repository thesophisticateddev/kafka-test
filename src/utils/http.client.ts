import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpClientService implements HttpModuleOptionsFactory {
  constructor(private readonly config: ConfigService) {}
  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions {
    return {
      timeout: this.config.getOrThrow<number>('HTTP_TIMEOUT'),
      maxRedirects: this.config.getOrThrow<number>('HTTP_MAX_REDIRECTS'),
    };
  }
}
