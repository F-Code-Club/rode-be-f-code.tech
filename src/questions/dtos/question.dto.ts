import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maxSubmitTime: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  score: number;
}

export class UpdateQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  stackId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  maxSubmitTimes: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  score: number;
}
