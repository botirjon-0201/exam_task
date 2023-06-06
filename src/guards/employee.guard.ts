import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (user.role !== 'EMPLOYEE')
      throw new ForbiddenException("Sorry you don't have access to the page");

    if (
      !user.organizations.some(
        (org) => org.OrganizationUser.user_id === user.id,
      )
    )
      throw new ForbiddenException("Sorry you aren't head of organization");

    return true;
  }
}
