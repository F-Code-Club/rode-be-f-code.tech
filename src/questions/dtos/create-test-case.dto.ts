import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTestCaseDto {
  @IsNotEmpty()
  question_id: string;
  @IsNotEmpty()
  input: string;
  @IsNotEmpty()
  output: string;
}
