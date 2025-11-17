import { Injectable, Inject } from '@nestjs/common';
import { UserRepo } from '../lib/repo/UserRepo';
import { PasswordService } from '../lib/services/password.service';
import { UserRole } from '../lib/enums/user.enum';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserSeeder {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly passwordService: PasswordService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async seed() {
    this.logger.info('Starting user seeding...');

    const users = [
      {
        name: 'Team Lead',
        email: 'teamlead@example.com',
        password: 'password123',
        role: UserRole.TEAM_LEAD,
      },
      {
        name: 'Member 1',
        email: 'member1@example.com',
        password: 'password123',
        role: UserRole.MEMBER,
      },
      {
        name: 'Member 2',
        email: 'member2@example.com',
        password: 'password123',
        role: UserRole.MEMBER,
      },
    ];

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await this.userRepo.findOne({
        email: userData.email,
      });

      if (existingUser) {
        this.logger.warn(
          `User with email ${userData.email} already exists, skipping...`,
        );
        continue;
      }

      // Hash password
      const hashedPassword = await this.passwordService.hashPassword(
        userData.password,
      );

      // Create user
      await this.userRepo.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      this.logger.info(`Created user: ${userData.email} (${userData.role})`);
    }

    this.logger.info('User seeding completed!');
  }
}
