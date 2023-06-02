import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../users/models/user.model';

@Injectable()
export class HeadGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (user.role !== 'HEAD')
      throw new ForbiddenException("Sorry you don't have access to the page");

    const dto = request.body;
    if (Object.keys(dto).length) {
      if (!user.organizations.some((org) => org.id === dto.org_id))
        throw new ForbiddenException("Sorry you aren't head of organization");
      return true;
    } else {
      return true;
    }
  }
}
