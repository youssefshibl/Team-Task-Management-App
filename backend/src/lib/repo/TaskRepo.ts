import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../base/BaseRepository';
import { Task } from '../entity/task.entity';
import { TaskModelName } from '../entity/task.entity';
import { Model } from 'mongoose';

export class TaskRepo extends BaseRepository<Task> {
  constructor(
    @InjectModel(TaskModelName)
    private readonly taskModel: Model<Task>,
  ) {
    super(taskModel);
  }
}
