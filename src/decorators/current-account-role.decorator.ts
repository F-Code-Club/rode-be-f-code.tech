import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const CurrentAccountRole = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user.role;
  },
);

export default CurrentAccountRole;
