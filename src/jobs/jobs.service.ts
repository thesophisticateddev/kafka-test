import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IJob, Job } from './entities/job.entity';
import { Model } from 'mongoose';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) {}
  create(createJobDto: CreateJobDto) {
    createJobDto.createdAt = new Date();
    return this.jobModel.create(createJobDto);
  }

  findAll(page: number, limit: number): Promise<IJob[]> {
    return this.jobModel.find({}, {}, { skip: page * limit, limit }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
