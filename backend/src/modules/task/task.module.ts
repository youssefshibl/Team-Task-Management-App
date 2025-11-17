import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskModelName, TaskSchema } from 'src/lib/entity/task.entity';
import { TaskRepo } from 'src/lib/repo/TaskRepo';
import { UserModelName, UserSchema } from 'src/lib/entity/user.entity';
import { UserRepo } from 'src/lib/repo/UserRepo';
import { UserValidator } from 'src/lib/utils/user-validator';
import { AuthJwtService } from 'src/lib/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TaskModelName,
        schema: TaskSchema,
      },
      {
        name: UserModelName,
        schema: UserSchema,
      },
    ]),
    JwtModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepo, UserRepo, UserValidator, AuthJwtService],
})
export class TaskModule {}
