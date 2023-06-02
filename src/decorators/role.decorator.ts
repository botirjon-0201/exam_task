import { UseGuards, applyDecorators } from '@nestjs/common';
import { UserRole } from '../users/models/user.model';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { HeadGuard } from '../guards/head.guard';

export const Role = (role: UserRole = 'EMPLOYEE') => {
  return applyDecorators(
    (role === 'ADMIN' && UseGuards(JwtAuthGuard, AdminGuard)) ||
      (role === 'EMPLOYEE' && UseGuards(JwtAuthGuard)) ||
      (role === 'HEAD' && UseGuards(JwtAuthGuard, HeadGuard)),
  );
};
