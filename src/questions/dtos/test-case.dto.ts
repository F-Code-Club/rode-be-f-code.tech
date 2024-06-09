import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTestCaseDto {
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
