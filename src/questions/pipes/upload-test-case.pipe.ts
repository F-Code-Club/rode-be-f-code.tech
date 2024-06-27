import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { fromBuffer } from 'file-type';

export class TestCaseFileValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File) {
    if (!value || !value.buffer) {
      throw new BadRequestException('File is required');
    }
    return value;
  }
}
