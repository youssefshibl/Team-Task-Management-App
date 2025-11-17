import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserValidator } from './user-validator';
import { UserRepo } from '../repo/UserRepo';

describe('UserValidator', () => {
  let validator: UserValidator;
  let userRepo: jest.Mocked<UserRepo>;

  const mockUserRepo = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserValidator,
        {
          provide: UserRepo,
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    validator = module.get<UserValidator>(UserValidator);
    userRepo = module.get(UserRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validateUserExists', () => {
    it('should not throw when user exists', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserRepo.findById.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      } as any);

      await expect(validator.validateUserExists(userId)).resolves.not.toThrow();
      expect(userRepo.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(validator.validateUserExists(userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(validator.validateUserExists(userId)).rejects.toThrow(
        'Assigned user not found',
      );
      expect(userRepo.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user is undefined', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUserRepo.findById.mockResolvedValue(undefined);

      await expect(validator.validateUserExists(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

