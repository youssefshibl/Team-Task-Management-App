import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enums/user.enum';

@Schema()
export class User {
  declare id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModelName = 'User';
