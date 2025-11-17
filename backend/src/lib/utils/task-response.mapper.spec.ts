import { TaskResponseMapper } from './task-response.mapper';
import { Task } from '../entity/task.entity';
import { TaskStatus } from '../enums/user.enum';
import { Types } from 'mongoose';

describe('TaskResponseMapper', () => {
  const mockTask: Task = {
    id: '507f1f77bcf86cd799439011',
    name: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    assignedTo: new Types.ObjectId('507f1f77bcf86cd799439012') as any,
    assignedBy: new Types.ObjectId('507f1f77bcf86cd799439013') as any,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  } as Task;

  describe('toResponse', () => {
    it('should map a single task to response format', () => {
      const result = TaskResponseMapper.toResponse(mockTask);

      expect(result).toEqual({
        id: mockTask.id,
        name: mockTask.name,
        description: mockTask.description,
        status: mockTask.status,
        assignedTo: mockTask.assignedTo,
        assignedBy: mockTask.assignedBy,
        createdAt: mockTask.createdAt,
        updatedAt: mockTask.updatedAt,
      });
    });

    it('should handle task with in_progress status', () => {
      const task = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      const result = TaskResponseMapper.toResponse(task);

      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should handle task with completed status', () => {
      const task = { ...mockTask, status: TaskStatus.COMPLETED };
      const result = TaskResponseMapper.toResponse(task);

      expect(result.status).toBe(TaskStatus.COMPLETED);
    });
  });

  describe('toResponseArray', () => {
    it('should map an array of tasks to response format', () => {
      const tasks: Task[] = [
        mockTask,
        { ...mockTask, id: '507f1f77bcf86cd799439014', name: 'Task 2' },
        { ...mockTask, id: '507f1f77bcf86cd799439015', name: 'Task 3' },
      ];

      const result = TaskResponseMapper.toResponseArray(tasks);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(mockTask.id);
      expect(result[1].name).toBe('Task 2');
      expect(result[2].name).toBe('Task 3');
    });

    it('should return empty array for empty input', () => {
      const result = TaskResponseMapper.toResponseArray([]);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should map each task correctly', () => {
      const tasks: Task[] = [
        { ...mockTask, status: TaskStatus.PENDING },
        { ...mockTask, status: TaskStatus.IN_PROGRESS },
        { ...mockTask, status: TaskStatus.COMPLETED },
      ];

      const result = TaskResponseMapper.toResponseArray(tasks);

      expect(result[0].status).toBe(TaskStatus.PENDING);
      expect(result[1].status).toBe(TaskStatus.IN_PROGRESS);
      expect(result[2].status).toBe(TaskStatus.COMPLETED);
    });
  });
});

