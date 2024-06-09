import { QuestionStackStatus, RoomTypeEnum } from '@etc/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveQuestionStackDto {}
export class CreateQuestionStackDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stackMax: number;

  @ApiProperty()
  @IsNotEmpty()
  status: QuestionStackStatus;

  @ApiProperty()
  @IsNotEmpty()
  type: RoomTypeEnum;
}

export class UpdateQuestionStackDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  stackMax: number;

  @ApiProperty()
  @IsNotEmpty()
  status: QuestionStackStatus;

  @ApiProperty()
  @IsNotEmpty()
  type: RoomTypeEnum;
}
