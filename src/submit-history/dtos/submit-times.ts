export class SubmitTimesDto {
  current?: number;
  max?: number;
  constructor(current: number, max: number) {
    this.current = current;
    this.max = max;
  }
}
