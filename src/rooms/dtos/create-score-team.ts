import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateScoreTeamDto {
  @ApiProperty()
  @IsNotEmpty()
  roomCode: string;
  @ApiProperty()
  teamIds: number[];
}
