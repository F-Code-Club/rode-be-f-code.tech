import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  max_submit_time: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  score: number;
}
