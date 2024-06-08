import { IsNotEmpty, Min } from 'class-validator';

export class UpdateRoomQuestionStackDto {
  @Min(1)
  roomId: number;
  @IsNotEmpty()
  stackId: string;
}
