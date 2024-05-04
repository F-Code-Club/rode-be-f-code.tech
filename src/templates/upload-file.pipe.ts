import { Injectable } from '@nestjs/common';

export enum FileMimeTypeEnum {
  PDF = 'application/pdf',
  PNG = 'image/png',
  JPG = 'image/jpeg',
  JPEG = 'image/jpeg',
  GIF = 'image/gif',
  SVG = 'image/svg+xml',
}

interface UploadFilesValidateOptions {
  destination?: string;
  maxCount?: number;
  maxFileSize?: number;
  allowedFileTypes?: FileMimeTypeEnum[];
}

@Injectable()
export class UploadFilePipe {
  constructor() {}
}
