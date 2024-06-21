import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { fromBuffer } from 'file-type';

export enum FileMimeTypeEnum {
  PDF = 'application/pdf',
  PNG = 'image/png',
  JPG = 'image/jpeg',
  JPEG = 'image/jpeg',
  // GIF = 'image/gif',
  // SVG = 'image/svg+xml',
}

interface UploadFilesValidateOptions {
  destination?: string;
  maxCount?: number;
  maxFileSize?: number;
  allowedFileTypes?: FileMimeTypeEnum[];
}

export class FileValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    if (!value || !value.buffer) {
      throw new BadRequestException('File is required');
    }

    const fileType = await fromBuffer(value.buffer);

    if (!fileType || !this.isValidType(fileType.mime)) {
      throw new BadRequestException(
        'File must be in these type: ' +
          Object.values<string>(FileMimeTypeEnum).join(', '),
      );
    }

    return value;
  }

  private isValidType(mime: string): boolean {
    console.log(mime);
    return Object.values<string>(FileMimeTypeEnum).includes(mime);
  }
}
