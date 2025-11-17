import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TaskRepo } from 'src/lib/repo/TaskRepo';
import { UserValidator } from 'src/lib/utils/user-validator';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { TaskStatus } from 'src/lib/enums/user.enum';
import { Types } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepo: TaskRepo,
    private readonly userValidator: UserValidator,
  ) {}

  async create(createTaskDto: CreateTaskDto, assignedById: string) {
    // Verify that assignedTo user exists
    await this.userValidator.validateUserExists(createTaskDto.assignedTo);

    // Check that task name is unique
    const existingTask = await this.taskRepo.findOne({
      name: createTaskDto.name,
    });
    if (existingTask) {
      throw new BadRequestException('Task name must be unique');
    }

    const task = await this.taskRepo.create({
      name: createTaskDto.name,
      description: createTaskDto.description,
      status: TaskStatus.PENDING,
      assignedTo: new Types.ObjectId(createTaskDto.assignedTo),
      assignedBy: new Types.ObjectId(assignedById),
    });

    const taskWithPopulate = await this.taskRepo.findOneWithPopulate(
      { _id: task.id },
      { path: 'assignedTo', select: 'name id' },
    );

    return taskWithPopulate;
  }

  async findAll(teamLeadId: string) {
    return this.taskRepo.findWithPopulate(
      { assignedBy: new Types.ObjectId(teamLeadId) },
      { path: 'assignedTo', select: 'name email' },
    );
  }

  async findOne(id: string) {
    return this.taskRepo.findById(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepo.findOneWithPopulate(
      { _id: id },
      {
        path: 'assignedTo',
        select: 'name email',
      },
    );
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (updateTaskDto.name !== undefined) {
      updateData.name = updateTaskDto.name;
    }
    if (updateTaskDto.description !== undefined) {
      updateData.description = updateTaskDto.description;
    }
    if (updateTaskDto.assignedTo !== undefined) {
      // Verify that assignedTo user exists
      await this.userValidator.validateUserExists(updateTaskDto.assignedTo);
      updateData.assignedTo = new Types.ObjectId(updateTaskDto.assignedTo);
    }

    return this.taskRepo.update(id, updateData);
  }

  async remove(id: string) {
    const task = await this.taskRepo.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.taskRepo.deleteById(id);
  }

  async updateStatus(taskId: string, status: TaskStatus, memberId: string) {
    const task = await this.taskRepo.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify that the member is assigned to this task
    const assignedToId = String(task.assignedTo);

    if (assignedToId !== memberId) {
      throw new ForbiddenException(
        'You are not authorized to update this task status',
      );
    }

    const updatedTask = await this.taskRepo.findOneAndUpdate(
      { _id: taskId },
      {
        status,
        updatedAt: new Date(),
      },
      {
        populate: {
          path: 'assignedBy',
          select: 'name email',
        },
      },
    );
    return updatedTask;
  }

  async getTasksAssignedToMe(memberId: string) {
    return await this.taskRepo.findWithPopulate(
      {
        assignedTo: new Types.ObjectId(memberId),
      },
      {
        path: 'assignedBy',
        select: 'name email',
      },
    );
  }

  async getStatistics(teamLeadId: string) {
    const tasks = await this.taskRepo.find({
      assignedBy: new Types.ObjectId(teamLeadId),
    });

    const statistics = {
      pending: 0,
      in_progress: 0,
      done: 0,
      total: tasks.length,
    };

    tasks.forEach((task) => {
      switch (task.status) {
        case TaskStatus.PENDING:
          statistics.pending++;
          break;
        case TaskStatus.IN_PROGRESS:
          statistics.in_progress++;
          break;
        case TaskStatus.COMPLETED:
          statistics.done++;
          break;
      }
    });

    return statistics;
  }
}
