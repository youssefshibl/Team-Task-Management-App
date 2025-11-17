import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base/BaseRepository';
import { User, UserModelName } from '../entity/user.entity';

export class UserRepo extends BaseRepository<User> {
  constructor(
    @InjectModel(UserModelName)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }
}
