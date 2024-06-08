import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTestCaseDto {
  @IsNotEmpty()
  questionId: string;

  @IsNotEmpty()
  input: string;

  @IsNotEmpty()
  output: string;
}

export class UpdateTestCaseDto {
  @ApiProperty()
  @IsNotEmpty()
  input: string;

  @ApiProperty()
  @IsNotEmpty()
  output: string;
}
