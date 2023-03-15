import { SubmitTimesDto } from 'submit-history/dtos/submit-times';

export class BeResultDto extends SubmitTimesDto {
  testCaseStatistics: boolean[];
  execTime: number;
}
