import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskRepo } from 'src/lib/repo/TaskRepo';
import { UserValidator } from 'src/lib/utils/user-validator';
import { TaskStatus } from 'src/lib/enums/user.enum';
import { Types } from 'mongoose';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: jest.Mocked<TaskRepo>;
  let userValidator: jest.Mocked<UserValidator>;

  const mockTaskRepo = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneWithPopulate: jest.fn(),
    findWithPopulate: jest.fn(),
    findWithPagination: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
  };

  const mockUserValidator = {
    validateUserExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepo,
          useValue: mockTaskRepo,
        },
        {
          provide: UserValidator,
          useValue: mockUserValidator,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get(TaskRepo);
    userValidator = module.get(UserValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTaskDto = {
      name: 'Test Task',
      description: 'Test Description',
      assignedTo: '507f1f77bcf86cd799439011',
    };
    const assignedById = '507f1f77bcf86cd799439012';

    it('should create a task successfully', async () => {
      const createdTask = {
        id: '507f1f77bcf86cd799439013',
        ...createTaskDto,
        status: TaskStatus.PENDING,
      };
      const populatedTask = {
        ...createdTask,
        assignedTo: { id: createTaskDto.assignedTo, name: 'Test User' },
      };

      mockUserValidator.validateUserExists.mockResolvedValue(undefined);
      mockTaskRepo.findOne.mockResolvedValue(null);
      mockTaskRepo.create.mockResolvedValue(createdTask as any);
      mockTaskRepo.findOneWithPopulate.mockResolvedValue(populatedTask as any);

      const result = await service.create(createTaskDto, assignedById);

      expect(userValidator.validateUserExists).toHaveBeenCalledWith(
        createTaskDto.assignedTo,
      );
      expect(taskRepo.findOne).toHaveBeenCalledWith({
        name: createTaskDto.name,
      });
      expect(taskRepo.create).toHaveBeenCalled();
      expect(result).toEqual(populatedTask);
    });

    it('should throw BadRequestException if task name already exists', async () => {
      mockUserValidator.validateUserExists.mockResolvedValue(undefined);
      mockTaskRepo.findOne.mockResolvedValue({ id: 'existing' } as any);

      await expect(service.create(createTaskDto, assignedById)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createTaskDto, assignedById)).rejects.toThrow(
        'Task name must be unique',
      );
    });

    it('should throw error if user does not exist', async () => {
      mockUserValidator.validateUserExists.mockRejectedValue(
        new NotFoundException('Assigned user not found'),
      );

      await expect(service.create(createTaskDto, assignedById)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllWithPagination', () => {
    const teamLeadId = '507f1f77bcf86cd799439012';
    const page = 1;
    const limit = 10;

    it('should return paginated tasks without filters', async () => {
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
        limit: 10,
        totalPages: 1,
      };

      mockTaskRepo.findWithPagination.mockResolvedValue(mockResult as any);

      const result = await service.findAllWithPagination(teamLeadId, page, limit);

      expect(taskRepo.findWithPagination).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should apply status filter', async () => {
      const filters = { status: TaskStatus.PENDING };
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockTaskRepo.findWithPagination.mockResolvedValue(mockResult as any);

      await service.findAllWithPagination(teamLeadId, page, limit, filters);

      expect(taskRepo.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ status: TaskStatus.PENDING }),
        page,
        limit,
        expect.any(Object),
      );
    });

    it('should apply assignedTo filter', async () => {
      const filters = { assignedTo: '507f1f77bcf86cd799439011' };
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockTaskRepo.findWithPagination.mockResolvedValue(mockResult as any);

      await service.findAllWithPagination(teamLeadId, page, limit, filters);

      expect(taskRepo.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          assignedTo: expect.any(Types.ObjectId),
        }),
        page,
        limit,
        expect.any(Object),
      );
    });
  });

  describe('updateStatus', () => {
    const taskId = '507f1f77bcf86cd799439013';
    const memberId = '507f1f77bcf86cd799439011';
    const status = TaskStatus.IN_PROGRESS;

    it('should update task status successfully', async () => {
      const existingTask = {
        id: taskId,
        assignedTo: new Types.ObjectId(memberId),
      };
      const updatedTask = {
        ...existingTask,
        status,
      };

      mockTaskRepo.findById.mockResolvedValue(existingTask as any);
      mockTaskRepo.findOneAndUpdate.mockResolvedValue(updatedTask as any);

      const result = await service.updateStatus(taskId, status, memberId);

      expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepo.findOneAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      mockTaskRepo.findById.mockResolvedValue(null);

      await expect(
        service.updateStatus(taskId, status, memberId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if member is not assigned to task', async () => {
      const existingTask = {
        id: taskId,
        assignedTo: new Types.ObjectId('507f1f77bcf86cd799439099'),
      };

      mockTaskRepo.findById.mockResolvedValue(existingTask as any);

      await expect(
        service.updateStatus(taskId, status, memberId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    const taskId = '507f1f77bcf86cd799439013';

    it('should delete a task successfully', async () => {
      const existingTask = { id: taskId, name: 'Test Task' };
      mockTaskRepo.findById.mockResolvedValue(existingTask as any);
      mockTaskRepo.deleteById.mockResolvedValue(existingTask as any);

      const result = await service.remove(taskId);

      expect(taskRepo.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepo.deleteById).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(existingTask);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      mockTaskRepo.findById.mockResolvedValue(null);

      await expect(service.remove(taskId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatistics', () => {
    const teamLeadId = '507f1f77bcf86cd799439012';

    it('should calculate statistics correctly', async () => {
      const tasks = [
        { status: TaskStatus.PENDING },
        { status: TaskStatus.PENDING },
        { status: TaskStatus.IN_PROGRESS },
        { status: TaskStatus.IN_PROGRESS },
        { status: TaskStatus.IN_PROGRESS },
        { status: TaskStatus.COMPLETED },
        { status: TaskStatus.COMPLETED },
        { status: TaskStatus.COMPLETED },
        { status: TaskStatus.COMPLETED },
      ];

      mockTaskRepo.find.mockResolvedValue(tasks as any);

      const result = await service.getStatistics(teamLeadId);

      expect(result).toEqual({
        pending: 2,
        in_progress: 3,
        done: 4,
        total: 9,
      });
    });

    it('should return zeros for empty task list', async () => {
      mockTaskRepo.find.mockResolvedValue([]);

      const result = await service.getStatistics(teamLeadId);

      expect(result).toEqual({
        pending: 0,
        in_progress: 0,
        done: 0,
        total: 0,
      });
    });
  });
});

