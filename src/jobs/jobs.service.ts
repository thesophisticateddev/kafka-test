import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaTopics } from '../utils/config';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDTO, JobStatus } from './entities/job.entity';

interface TestResponse {
  id: string;
  name: string;
  age: number;
}

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly kafkaService: KafkaService,
  ) {}
  async create(createJobDto: CreateJobDto) {
    createJobDto.createdAt = new Date();
    createJobDto.status = JobStatus.SCHEDULED;
    const result = await this.jobModel.create(createJobDto);
    this.kafkaService.sendMessage(
      KafkaTopics.RUST_CONSUMER,
      JSON.stringify({
        ...result.toJSON(),
        text: [
          'My email is salman.sc829@gmail.com',
          'My phone number is 1234567890',
        ],
      }),
    );
    const jsonRes = result.toJSON();
    return new JobDTO(jsonRes);
  }

  findAll(page: number, limit: number): Promise<Job[]> {
    return this.jobModel.find({}, {}, { skip: page * limit, limit }).exec();
  }

  findOne(id: string): Promise<JobDTO> {
    return this.jobModel
      .findById(id)
      .exec()
      .then((res) => {
        return new JobDTO(res.toJSON());
      });
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    return this.jobModel.updateOne({ _id: id }, { $set: updateJobDto }).exec();
  }

  remove(id: string) {
    return this.jobModel.deleteOne({ _id: id }).exec();
  }

  async updateJobPost() {
    const urlPath = 'some url here';
    const response = await firstValueFrom(
      this.httpService.post<TestResponse>(urlPath, {}),
    );

    console.log('Resposne', response);
  }
}
