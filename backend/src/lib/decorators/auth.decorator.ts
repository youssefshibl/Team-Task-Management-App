import { SetMetadata } from '@nestjs/common';
import { IAuthRequest } from '../interfaces/auth.interface';

export const Auth = (...auth: IAuthRequest[]) => SetMetadata('auth', auth);
