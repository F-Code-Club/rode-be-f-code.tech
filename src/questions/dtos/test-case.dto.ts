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
  isVisible: boolean;
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
  isVisible: boolean;
}

export class CreateTestCaseByFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  inpFile: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary' })
  outFile: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  isVisible: boolean;
}
