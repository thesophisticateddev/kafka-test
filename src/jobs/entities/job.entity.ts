import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

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

// export interface IJob {
//   id: string;
//   name: string;
//   createdAt: Date;
//   startTime: Date;
//   status: JobStatus;
// }

// export interface IJob extends Document<Job> {
//   id: string;
// }

// export interface IJob extends Job {
//   id: string;
// }

export type IJob = HydratedDocument<Job>;
