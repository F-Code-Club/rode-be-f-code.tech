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
  @ApiProperty({ type: String, title: 'This is room code, need to be unique' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: Date,
    title:
      'This is open time of room, need to be larger than present and smaller than close time',
  })
  @IsDate()
  @MinDate(new Date())
  @Type(() => Date)
  openTime: Date;

  @ApiProperty({
    type: Date,
    title:
      'This is close time of room, need to be larger than present and bigger than open time',
  })
  @IsDate()
  @IsGreaterThan('openTime', {
    message: 'Close time must be greater than open time',
  })
  @Type(() => Date)
  @IsOptional()
  closeTime: Date;

  @ApiProperty({
    enum: RoomTypeEnum,
    title:
      'This is room type, have 2 type: FE, BE. This is still use on question stack too',
  })
  @IsEnum(RoomTypeEnum)
  type: RoomTypeEnum;

  @ApiProperty({
    default: false,
    type: Boolean,
    title: 'When this room is private, user can not see or enter this room',
  })
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({ type: String, title: 'The question stack id is uuid' })
  questionStackId: string;
}
