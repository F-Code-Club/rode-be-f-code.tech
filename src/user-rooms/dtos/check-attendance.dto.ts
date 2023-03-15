import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckAttendanceDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  id: string[];
}
