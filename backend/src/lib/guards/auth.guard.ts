import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthJwtService } from '../services/jwt.service';
import { IAuthRequest, IJwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check if the request has the accessLevel metadata
    // getAllAndOverride gets metadata from handler first, then class
    const auth: IAuthRequest[] = this.reflector.getAllAndOverride<
      IAuthRequest[]
    >('auth', [context.getHandler(), context.getClass()]);
    if (!auth || auth.length === 0) {
      return true;
    }
    // add user to the request object
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; user: IJwtPayload }>();

    // Extract token from Authorization header (Bearer <token>)
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    let decoded: IJwtPayload;
    try {
      decoded = (await this.authJwtService.verifyToken(token)) as IJwtPayload;
    } catch (_) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Check if the user has access to the resource
    // User passes if ANY auth requirement is satisfied (OR logic)
    const isAuthorized = auth.some((authReq) => {
      // If no role is specified, any authenticated user can access
      if (!authReq.role) {
        return true;
      }
      // If role is specified, user's role must match
      return decoded.role === authReq.role;
    });

    if (!isAuthorized) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }

    // Attach user to request object
    request.user = decoded;
    return true;
  }
}
