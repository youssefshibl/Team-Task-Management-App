import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatus } from '../enums/user.enum';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { UserModelName } from './user.entity';

@Schema()
export class Task {
  declare id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: UserModelName,
  })
  assignedTo: Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: UserModelName,
  })
  assignedBy: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
// make index for assignedTo and assignedBy
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ assignedBy: 1 });

export const TaskModelName = 'Task';
