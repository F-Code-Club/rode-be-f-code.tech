import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @ApiProperty()
  @IsOptional()
  code?: string;
}
