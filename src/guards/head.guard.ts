import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class HeadGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const { user, body } = context.switchToHttp().getRequest();
    if (user.role !== 'HEAD')
      throw new ForbiddenException("Sorry you don't have access to the page");

    if (Object.keys(body).length && body.org_id)
      if (!user.organizations.some((org) => org.id === body.org_id))
        throw new ForbiddenException("Sorry you aren't head of organization");

    return true;
  }
}
