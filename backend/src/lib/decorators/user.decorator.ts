// make paramter decorator to get the user from the request object
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/auth.interface';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IJwtPayload;
  },
);

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.user as IJwtPayload).id;
  },
);
