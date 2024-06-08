import { IsGreaterThan } from '@etc/custom-validators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinDate,
} from 'class-validator';
import { RoomTypeEnum } from '../../etc/enums';

export class CreateRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsDate()
  @MinDate(new Date())
  @Type(() => Date)
  openTime: Date;

  @ApiProperty()
  @IsDate()
  @IsGreaterThan('openTime', {
    message: 'Close time must be greater than open time',
  })
  @Type(() => Date)
  @IsOptional()
  closeTime: Date;

  @ApiProperty({ enum: RoomTypeEnum })
  @IsEnum(RoomTypeEnum)
  type: RoomTypeEnum;

  @ApiProperty({ default: false })
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  questionStackId: string;
}
