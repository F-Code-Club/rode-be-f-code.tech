import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTestCaseDto {
  @ApiProperty()
  @IsNotEmpty()
  question_id: string;

  @ApiProperty()
  @IsNotEmpty()
  input: string;

  @ApiProperty()
  @IsNotEmpty()
  output: string;
}
