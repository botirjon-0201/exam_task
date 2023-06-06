import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserTypeData } from '../users/models/user.model';

export const GetUser = createParamDecorator(
  async (data: UserTypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
