import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';

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
export class UploadFilePipe implements PipeTransform {
  constructor(private readonly options?: UploadFilesValidateOptions) {}

  transform(value: Express.Multer.File[], metadata: ArgumentMetadata) {
    if (this.options) {
      if (this.options.maxCount && value.length > this.options.maxCount) {
        throw new BadRequestException(
          `Max file count is ${this.options.maxCount}`,
        );
      }
      if (this.options.maxFileSize) {
        const fileTooLarge = value.find(
          (file) => file.size > this.options.maxFileSize,
        );
        if (fileTooLarge) {
          throw new BadRequestException(
            `Max file size is ${this.options.maxFileSize}`,
          );
        }
      }
      if (this.options.allowedFileTypes) {
        const fileNotAllowed = value.find(
          (file) =>
            !this.options.allowedFileTypes.includes(
              file.mimetype as FileMimeTypeEnum,
            ),
        );
        if (fileNotAllowed) {
          throw new BadRequestException(`File type not allowed`);
        }
      }
    }
    const result = [];
    for (const file of value) {
      file.destination = this.options.destination;
      file.filename = `${randomUUID()} - ${file.originalname}`;
      file.path = `${file.destination}/${file.filename}`;
      if (!fs.existsSync(this.options.destination)) {
        fs.mkdirSync(this.options.destination, { recursive: true });
      }
      fs.writeFileSync(file.path, file.buffer);
      result.push(file);
    }
    return result;
  }
}
