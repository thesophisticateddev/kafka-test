import { IsDateString, IsNotEmpty } from 'class-validator';
import { JobStatus } from '../entities/job.entity';

export class CreateJobDto {
  @IsNotEmpty()
  name: string;
  createdAt: Date;
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  status: JobStatus;
}
