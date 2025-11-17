import { Task } from '../entity/task.entity';

export class TaskResponseMapper {
  static toResponse(task: Task) {
    return {
      id: task.id,
      name: task.name,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo,
      assignedBy: task.assignedBy,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  static toResponseArray(tasks: Task[]) {
    return tasks.map((task) => this.toResponse(task));
  }
}
