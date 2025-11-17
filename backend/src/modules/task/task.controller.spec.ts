import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskStatus, UserRole } from 'src/lib/enums/user.enum';
import { Types } from 'mongoose';
import { IJwtPayload } from 'src/lib/interfaces/auth.interface';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: jest.Mocked<TaskService>;

  const mockTaskService = {
    create: jest.fn(),
    findAllWithPagination: jest.fn(),
    getTasksAssignedToMeWithPagination: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
    getStatistics: jest.fn(),
  };

  const mockUser: IJwtPayload = {
    id: '507f1f77bcf86cd799439012',
    email: 'test@example.com',
    role: UserRole.TEAM_LEAD,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createTaskDto = {
      name: 'Test Task',
      description: 'Test Description',
      assignedTo: '507f1f77bcf86cd799439011',
    };

    it('should create a task successfully', async () => {
      const mockTask = {
        id: '507f1f77bcf86cd799439013',
        ...createTaskDto,
        status: TaskStatus.PENDING,
        assignedBy: new Types.ObjectId(mockUser.id),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskService.create.mockResolvedValue(mockTask as any);

      const result = await controller.create(createTaskDto, mockUser);

      expect(taskService.create).toHaveBeenCalledWith(
        createTaskDto,
        mockUser.id,
      );
      expect(result).toEqual({
        message: 'Task created successfully',
        data: expect.objectContaining({
          id: mockTask.id,
          name: mockTask.name,
        }),
      });
    });

    it('should throw NotFoundException if task is not created', async () => {
      mockTaskService.create.mockResolvedValue(null);

      await expect(controller.create(createTaskDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const filterDto = { page: 1, limit: 30 };
      const mockResult = {
        data: [
          {
            id: '1',
            name: 'Task 1',
            status: TaskStatus.PENDING,
          },
        ],
        total: 1,
        page: 1,
        limit: 30,
        totalPages: 1,
      };

      mockTaskService.findAllWithPagination.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockUser, filterDto);

      expect(taskService.findAllWithPagination).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Tasks fetched successfully',
        data: expect.any(Array),
        pagination: {
          page: 1,
          limit: 30,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should apply filters correctly', async () => {
      const filterDto = {
        page: 1,
        limit: 30,
        status: TaskStatus.PENDING,
        assignedTo: '507f1f77bcf86cd799439011',
      };
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 30,
        totalPages: 0,
      };

      mockTaskService.findAllWithPagination.mockResolvedValue(mockResult);

      await controller.findAll(mockUser, filterDto);

      expect(taskService.findAllWithPagination).toHaveBeenCalledWith(
        mockUser.id,
        1,
        30,
        {
          status: TaskStatus.PENDING,
          assignedTo: filterDto.assignedTo,
        },
      );
    });
  });

  describe('getTasksAssignedToMe', () => {
    const memberUser: IJwtPayload = {
      id: '507f1f77bcf86cd799439011',
      email: 'member@example.com',
      role: UserRole.MEMBER,
    };

    it('should return paginated tasks for member', async () => {
      const filterDto = { page: 1, limit: 30 };
      const mockResult = {
        data: [
          {
            id: '1',
            name: 'Task 1',
            status: TaskStatus.PENDING,
          },
        ],
        total: 1,
        page: 1,
        limit: 30,
        totalPages: 1,
      };

      mockTaskService.getTasksAssignedToMeWithPagination.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getTasksAssignedToMe(memberUser, filterDto);

      expect(
        taskService.getTasksAssignedToMeWithPagination,
      ).toHaveBeenCalledWith(memberUser.id, 1, 30, {});
      expect(result).toEqual({
        message: 'Tasks fetched successfully',
        data: expect.any(Array),
        pagination: expect.any(Object),
      });
    });
  });

  describe('getStatistics', () => {
    it('should return task statistics', async () => {
      const mockStatistics = {
        pending: 5,
        in_progress: 3,
        done: 2,
        total: 10,
      };

      mockTaskService.getStatistics.mockResolvedValue(mockStatistics);

      const result = await controller.getStatistics(mockUser);

      expect(taskService.getStatistics).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        message: 'Statistics fetched successfully',
        data: mockStatistics,
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const taskId = '507f1f77bcf86cd799439013';
      const mockTask = {
        id: taskId,
        name: 'Test Task',
        status: TaskStatus.PENDING,
      };

      mockTaskService.findOne.mockResolvedValue(mockTask as any);

      const result = await controller.findOne(taskId);

      expect(taskService.findOne).toHaveBeenCalledWith(taskId);
      expect(result).toEqual({
        message: 'Task fetched successfully',
        data: expect.objectContaining({
          id: taskId,
        }),
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = '507f1f77bcf86cd799439013';
      mockTaskService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskId = '507f1f77bcf86cd799439013';
      const updateTaskDto = {
        name: 'Updated Task',
        description: 'Updated Description',
      };
      const mockTask = {
        id: taskId,
        ...updateTaskDto,
        status: TaskStatus.PENDING,
      };

      mockTaskService.update.mockResolvedValue(mockTask as any);

      const result = await controller.update(taskId, updateTaskDto);

      expect(taskService.update).toHaveBeenCalledWith(taskId, updateTaskDto);
      expect(result).toEqual({
        message: 'Task updated successfully',
        data: expect.objectContaining({
          id: taskId,
          name: updateTaskDto.name,
        }),
      });
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const taskId = '507f1f77bcf86cd799439013';
      const mockTask = {
        id: taskId,
        name: 'Test Task',
      };

      mockTaskService.remove.mockResolvedValue(mockTask as any);

      const result = await controller.remove(taskId);

      expect(taskService.remove).toHaveBeenCalledWith(taskId);
      expect(result).toEqual({
        message: 'Task deleted successfully',
      });
    });
  });

  describe('updateStatus', () => {
    it('should update task status successfully', async () => {
      const taskId = '507f1f77bcf86cd799439013';
      const updateStatusDto = { status: TaskStatus.IN_PROGRESS };
      const memberUser: IJwtPayload = {
        id: '507f1f77bcf86cd799439011',
        email: 'member@example.com',
        role: UserRole.MEMBER,
      };
      const mockTask = {
        id: taskId,
        status: TaskStatus.IN_PROGRESS,
      };

      mockTaskService.updateStatus.mockResolvedValue(mockTask as any);

      const result = await controller.updateStatus(
        taskId,
        updateStatusDto,
        memberUser,
      );

      expect(taskService.updateStatus).toHaveBeenCalledWith(
        taskId,
        updateStatusDto.status,
        memberUser.id,
      );
      expect(result).toEqual({
        message: 'Task status updated successfully',
        data: expect.objectContaining({
          id: taskId,
          status: TaskStatus.IN_PROGRESS,
        }),
      });
    });
  });
});

