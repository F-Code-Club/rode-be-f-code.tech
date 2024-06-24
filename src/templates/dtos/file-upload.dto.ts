import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
  @ApiProperty({ required: false })
  colorCode: string;
}

export class UpdateTemplateDto {
  @ApiProperty({ required: false })
  colorCode: string;
}
