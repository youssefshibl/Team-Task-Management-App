import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TaskRepo } from '../lib/repo/TaskRepo';
import { TaskStatus } from '../lib/enums/user.enum';
import { Types } from 'mongoose';

interface SeederUser {
  id?: string;
  _id?: Types.ObjectId | string;
  name?: string;
  email?: string;
}

@Injectable()
export class TaskSeeder {
  constructor(
    private readonly taskRepo: TaskRepo,
    private readonly configService: ConfigService,
  ) {}

  async seed(leaders: SeederUser[], members: SeederUser[]) {
    console.log('Starting task seeding...');

    const tasksPerMember =
      parseInt(
        this.configService.get<string>('SEED_TASKS_PER_MEMBER') || '10',
        10,
      ) || 10;

    console.log(`Creating ${tasksPerMember} tasks per member...`);

    const statuses: TaskStatus[] = [
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ];

    let totalTasksCreated = 0;

    // Validate inputs
    if (!leaders || leaders.length === 0) {
      console.error('No leaders available to assign tasks');
      throw new Error('No leaders available to assign tasks');
    }

    if (!members || members.length === 0) {
      console.warn('No members available, skipping task creation');
      return;
    }

    // Distribute members across leaders
    const membersPerLeader = Math.ceil(members.length / leaders.length);

    for (let memberIndex = 0; memberIndex < members.length; memberIndex++) {
      const member = members[memberIndex];
      const leaderIndex = Math.floor(memberIndex / membersPerLeader);
      const assignedBy = leaders[leaderIndex] || leaders[0]; // Fallback to first leader

      // Validate member and leader have valid IDs
      const memberId =
        member.id ||
        (member._id instanceof Types.ObjectId
          ? member._id.toString()
          : String(member._id || '')) ||
        null;
      const leaderId =
        assignedBy.id ||
        (assignedBy._id instanceof Types.ObjectId
          ? assignedBy._id.toString()
          : String(assignedBy._id || '')) ||
        null;

      if (!memberId || !leaderId) {
        console.warn(
          `Skipping member ${memberIndex + 1}: Invalid member or leader ID`,
        );
        continue;
      }

      // Create tasks for this member
      for (let taskNum = 1; taskNum <= tasksPerMember; taskNum++) {
        // Distribute statuses evenly
        const statusIndex = (taskNum - 1) % statuses.length;
        const status = statuses[statusIndex];

        const memberName = member.name || `Member ${memberIndex + 1}`;
        const taskName = `Task ${taskNum} - ${memberName} - ${memberIndex + 1}`;
        const taskDescription = `This is task number ${taskNum} assigned to ${memberName} (Member ${memberIndex + 1}). Status: ${status}`;

        // Check if task already exists
        const existingTask = await this.taskRepo.findOne({ name: taskName });

        if (existingTask) {
          console.warn(
            `Task with name "${taskName}" already exists, skipping...`,
          );
          continue;
        }

        // Create task
        await this.taskRepo.create({
          name: taskName,
          description: taskDescription,
          status,
          assignedTo: new Types.ObjectId(String(memberId)),
          assignedBy: new Types.ObjectId(String(leaderId)),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        totalTasksCreated++;
      }

      if ((memberIndex + 1) % 10 === 0) {
        console.log(
          `Progress: Created tasks for ${memberIndex + 1}/${members.length} members`,
        );
      }
    }

    console.log(`Task seeding completed! Created ${totalTasksCreated} tasks.`);
  }
}
