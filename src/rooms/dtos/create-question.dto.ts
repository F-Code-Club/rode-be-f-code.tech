import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  Min,
} from 'class-validator';
import { CreateQuestionTestCaseDto } from './create-question-testcase.dto';

export class CreateQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  questionImage: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxSubmitTimes?: number;

  @ApiProperty({ required: false })
  @Matches(/^#\w{6}(,#\w{6})*$/)
  @IsOptional()
  colors?: string;

  @ApiProperty({ required: false })
  codeTemplate?: string;

  @ApiProperty({ type: [CreateQuestionTestCaseDto], required: false })
  testCases?: CreateQuestionTestCaseDto[];
}
