import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTestCaseDto {
  @ApiProperty()
  @IsNotEmpty()
  input: string;

  @ApiProperty()
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
