import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepo } from '../repo/UserRepo';

@Injectable()
export class UserValidator {
  constructor(private readonly userRepo: UserRepo) {}

  async validateUserExists(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Assigned user not found');
    }
  }
}

