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

    // Helper function to get random leader
    const getRandomLeader = (): SeederUser => {
      const randomIndex = Math.floor(Math.random() * leaders.length);
      return leaders[randomIndex] || leaders[0];
    };

    // Helper function to get random status
    const getRandomStatus = (): TaskStatus => {
      const randomIndex = Math.floor(Math.random() * statuses.length);
      return statuses[randomIndex] || TaskStatus.PENDING;
    };

    for (let memberIndex = 0; memberIndex < members.length; memberIndex++) {
      const member = members[memberIndex];

      // Validate member has valid ID
      const memberId =
        member.id ||
        (member._id instanceof Types.ObjectId
          ? member._id.toString()
          : String(member._id || '')) ||
        null;

      if (!memberId) {
        console.warn(`Skipping member ${memberIndex + 1}: Invalid member ID`);
        continue;
      }

      // Create tasks for this member
      for (let taskNum = 1; taskNum <= tasksPerMember; taskNum++) {
        // Randomly assign a leader for each task
        const assignedBy = getRandomLeader();
        const leaderId =
          assignedBy.id ||
          (assignedBy._id instanceof Types.ObjectId
            ? assignedBy._id.toString()
            : String(assignedBy._id || '')) ||
          null;

        if (!leaderId) {
          console.warn(
            `Skipping task ${taskNum} for member ${memberIndex + 1}: Invalid leader ID`,
          );
          continue;
        }

        // Randomly assign status
        const status = getRandomStatus();

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

        // Randomize creation date (within last 30 days)
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30); // Random days between 0-29
        const hoursAgo = Math.floor(Math.random() * 24); // Random hours
        const minutesAgo = Math.floor(Math.random() * 60); // Random minutes
        const createdAt = new Date(
          now.getTime() -
            daysAgo * 24 * 60 * 60 * 1000 -
            hoursAgo * 60 * 60 * 1000 -
            minutesAgo * 60 * 1000,
        );

        // Updated date is same as created or slightly later (for completed tasks)
        const updatedAt =
          status === TaskStatus.COMPLETED
            ? new Date(
                createdAt.getTime() +
                  Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
              ) // 0-7 days after creation
            : createdAt;

        // Create task
        await this.taskRepo.create({
          name: taskName,
          description: taskDescription,
          status,
          assignedTo: new Types.ObjectId(String(memberId)),
          assignedBy: new Types.ObjectId(String(leaderId)),
          createdAt,
          updatedAt,
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
