import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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

export class UpdateTestCaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  input: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  output: string;
}
