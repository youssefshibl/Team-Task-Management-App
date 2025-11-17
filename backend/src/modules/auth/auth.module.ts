import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelName, UserSchema } from 'src/lib/entity/user.entity';
import { UserRepo } from 'src/lib/repo/UserRepo';
import { AuthJwtService } from 'src/lib/services/jwt.service';
import { PasswordService } from 'src/lib/services/password.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      {
        name: UserModelName,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthJwtService, UserRepo, PasswordService],
})
export class AuthModule {}
