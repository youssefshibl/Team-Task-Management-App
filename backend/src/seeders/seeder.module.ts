import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModelName, UserSchema } from '../lib/entity/user.entity';
import { TaskModelName, TaskSchema } from '../lib/entity/task.entity';
import { UserRepo } from '../lib/repo/UserRepo';
import { TaskRepo } from '../lib/repo/TaskRepo';
import { PasswordService } from '../lib/services/password.service';
import { UserSeeder } from './user.seeder';
import { TaskSeeder } from './task.seeder';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: UserModelName,
        schema: UserSchema,
      },
      {
        name: TaskModelName,
        schema: TaskSchema,
      },
    ]),
  ],
  providers: [UserSeeder, TaskSeeder, UserRepo, TaskRepo, PasswordService],
})
export class SeederModule {}
