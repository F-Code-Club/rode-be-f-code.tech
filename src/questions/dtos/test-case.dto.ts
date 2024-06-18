import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTestCaseDto {
  @ApiProperty()
  @IsNotEmpty()
  input: string;

  @ApiProperty()
  @IsNotEmpty()
  output: string;

  @ApiProperty()
  @IsNotEmpty()
  isVisiable: boolean;
}

export class UpdateTestCaseDto {
  @ApiProperty()
  @IsNotEmpty()
  input: string;

  @ApiProperty()
  @IsNotEmpty()
  output: string;

  @ApiProperty()
  @IsNotEmpty()
  isVisiable: boolean;
}
