import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class PasswordResetGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      throw new ForbiddenException('Authorization header is missing');
    }

    // Extract token from Bearer token
    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new ForbiddenException('Invalid authorization header format');
    }

    // Verify token validity
    const isValid = await this.usersService.verifyResetPasswordToken(token);

    if (!isValid) {
      throw new ForbiddenException('Invalid or expired token');
    }

    return true;
  }
}
