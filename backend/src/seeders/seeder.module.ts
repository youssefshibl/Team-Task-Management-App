import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelName, UserSchema } from '../lib/entity/user.entity';
import { UserRepo } from '../lib/repo/UserRepo';
import { PasswordService } from '../lib/services/password.service';
import { UserSeeder } from './user.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModelName,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserSeeder, UserRepo, PasswordService],
})
export class SeederModule {}
