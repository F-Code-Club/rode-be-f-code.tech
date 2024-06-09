import { QuestionStackStatus, RoomTypeEnum } from '@etc/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateQuestionStackDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  stack_max: number;

  @ApiProperty()
  @IsNotEmpty()
  status: QuestionStackStatus;

  @ApiProperty()
  @IsNotEmpty()
  type: RoomTypeEnum;
}
