import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateScoreTeamDto {
  @IsNotEmpty()
  roomCode: string;
  @IsArray()
  teamIds: number[];
}
