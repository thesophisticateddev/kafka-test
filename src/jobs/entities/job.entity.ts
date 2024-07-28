import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum JobStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
  IN_PROGRESS = 'in-progress',
  SCHEDULED = 'scheduled',
}

@Schema()
export class Job {
  @Prop()
  name: string;
  @Prop()
  createdAt: Date;

  @Prop()
  startTime: Date;

  @Prop()
  status: JobStatus;
}

export const JobSchema = SchemaFactory.createForClass(Job);

export type IJob = Document<Job>;
