import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  stack_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  max_submit_time: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  score: number;
}

export class UpdateQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  stack_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maxSubmitTimes: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  score: number;
}