import { UserRole } from '../enums/user.enum';

export interface IAuthRequest {
  role?: UserRole;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
