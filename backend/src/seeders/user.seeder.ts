import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepo } from '../lib/repo/UserRepo';
import { PasswordService } from '../lib/services/password.service';
import { UserRole } from '../lib/enums/user.enum';
import { Types } from 'mongoose';

interface SeederUser {
  id?: string;
  _id?: Types.ObjectId | string;
  name?: string;
  email?: string;
}

@Injectable()
export class UserSeeder {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<{ leaders: SeederUser[]; members: SeederUser[] }> {
    console.log('Starting user seeding...');

    const numLeaders =
      parseInt(
        this.configService.get<string>('SEED_LEADERS_COUNT') || '5',
        10,
      ) || 5;
    const numMembers =
      parseInt(
        this.configService.get<string>('SEED_MEMBERS_COUNT') || '50',
        10,
      ) || 50;

    console.log(`Creating ${numLeaders} leaders and ${numMembers} members...`);

    const leaders: SeederUser[] = [];
    const members: SeederUser[] = [];

    // Create leaders
    for (let i = 1; i <= numLeaders; i++) {
      try {
        const email = `teamlead${i}@example.com`;
        const name = `Team Lead ${i}`;

        // Check if user already exists
        const existingUser = await this.userRepo.findOne({ email });

        if (existingUser) {
          console.warn(`User with email ${email} already exists, skipping...`);
          leaders.push(existingUser);
          continue;
        }

        // Hash password
        const hashedPassword =
          await this.passwordService.hashPassword('password123');

        // Create user
        const user = await this.userRepo.create({
          name,
          email,
          password: hashedPassword,
          role: UserRole.TEAM_LEAD,
        });

        leaders.push(user);
        console.log(`Created leader: ${email}`);
      } catch (error) {
        console.error(`Error creating leader ${i}:`, error);
        throw error;
      }
    }

    // Create members
    for (let i = 1; i <= numMembers; i++) {
      try {
        const email = `member${i}@example.com`;
        const name = `Member ${i}`;

        // Check if user already exists
        const existingUser = await this.userRepo.findOne({ email });

        if (existingUser) {
          console.warn(`User with email ${email} already exists, skipping...`);
          members.push(existingUser);
          continue;
        }

        // Hash password
        const hashedPassword =
          await this.passwordService.hashPassword('password123');

        // Create user
        const user = await this.userRepo.create({
          name,
          email,
          password: hashedPassword,
          role: UserRole.MEMBER,
        });

        members.push(user);
        console.log(`Created member: ${email}`);
      } catch (error) {
        console.error(`Error creating member ${i}:`, error);
        throw error;
      }
    }

    console.log(
      `User seeding completed! Created ${leaders.length} leaders and ${members.length} members.`,
    );

    return { leaders, members };
  }
}
