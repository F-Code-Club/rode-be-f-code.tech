import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  stack_id: string;
  @IsNotEmpty()
  @IsNumber()
  max_submit_time: number;
  @IsNotEmpty()
  @IsNumber()
  score: number;
}
