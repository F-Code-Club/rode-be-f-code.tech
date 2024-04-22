import { RoleEnum } from '@etc/enums';
import { IsNotEmpty } from 'class-validator';

export class UpdateRoleAccountDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  role: RoleEnum;
}
