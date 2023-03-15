import { IsGreaterThan } from '@etc/custom-validators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { RoomTypeEnum } from '../../etc/enums';
import { CreateQuestionDto } from './create-question.dto';

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

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  duration: number;

  @ApiProperty({ enum: RoomTypeEnum })
  @IsEnum(RoomTypeEnum)
  type: RoomTypeEnum;

  @ApiProperty({ default: false })
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({ type: [CreateQuestionDto] })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
