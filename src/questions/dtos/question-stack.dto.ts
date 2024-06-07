import { QuestionStackStatus, RoomTypeEnum } from '@etc/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateQuestionStackDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stack_max: number;

  @ApiProperty()
  @IsNotEmpty()
  status: QuestionStackStatus;

  @ApiProperty()
  @IsNotEmpty()
  type: RoomTypeEnum;
}

export class UpdateQuestionStackDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  stack_max?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  status?: QuestionStackStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  type?: RoomTypeEnum;
}

export class RemoveQuestionStackDto {}
