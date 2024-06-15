import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateScoreTeamDto {
  @ApiProperty()
  @IsNotEmpty()
  roomCode: string;
  @ApiProperty({ type: [Number] })
  @IsArray({ each: true })
  teamIds: number[];
}
