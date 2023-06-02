import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User, UserTypeData } from '../users/models/user.model';

export const GetUser = createParamDecorator(
  (data: UserTypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
