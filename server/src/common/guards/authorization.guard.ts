import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const userRoles = req.currentUser?.roles;

      // Check if userRoles is a single role, not an array
      if (userRoles && allowedRoles.includes(userRoles)) {
        return true;
      }

      throw new UnauthorizedException('No estás autorizado');
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
};
