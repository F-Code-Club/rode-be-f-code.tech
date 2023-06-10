import { ApiProperty } from '@nestjs/swagger';

export class RenderImageDto {
  @ApiProperty()
  html: string;

  @ApiProperty()
  srcWidth: number;

  @ApiProperty()
  srcHeight: number;
}
