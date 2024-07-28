import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './entities/job.entity';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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
  ) {}
  create(createJobDto: CreateJobDto) {
    createJobDto.createdAt = new Date();
    return this.jobModel.create(createJobDto);
  }

  findAll(page: number, limit: number): Promise<Job[]> {
    return this.jobModel.find({}, {}, { skip: page * limit, limit }).exec();
  }

  findOne(id: string) {
    return this.jobModel.findById(id).exec();
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    return this.jobModel.updateOne({ _id: id }, { $set: updateJobDto }).exec();
  }

  remove(id: string) {
    return this.jobModel.deleteOne({ _id: id }).exec();
  }

  async updateJobPost() {
    const baseUrl = 'some url here';
    const response = await firstValueFrom(
      this.httpService.post<TestResponse>(baseUrl, {}),
    );

    console.log('Resposne', response);
  }
}
