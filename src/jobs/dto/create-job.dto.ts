import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  name: string;
  createdAt: Date;
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;
}
