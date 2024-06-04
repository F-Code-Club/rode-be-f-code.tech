import { QuestionStackStatus, RoomTypeEnum } from '@etc/enums';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuestionStackDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  stack_max: number;

  @IsNotEmpty()
  status: QuestionStackStatus;
  @IsNotEmpty()
  type: RoomTypeEnum;
}
