import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './entities/job.entity';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from 'src/utils/http.client';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    HttpModule.registerAsync({
      useClass: HttpClientService,
      inject: [ConfigService],
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
