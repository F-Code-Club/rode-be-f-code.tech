import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';
export class UpdateRoomQuestionStackDto {
  @Min(1)
  @ApiProperty()
  roomId: number;
  @IsNotEmpty()
  @ApiProperty()
  stackId: string;
}
