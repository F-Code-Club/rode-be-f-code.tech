import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Template } from './entities/templates.entity';
import { GoogleApiService } from 'google-api/google-api.service';
import { FileUploadDto } from './dtos/file-upload.dto';
import RodeConfig from '@etc/config';
import { LogService } from '@logger/logger.service';
import { randomUUID } from 'crypto';
import { Question } from '@questions/entities/question.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    private readonly googleApiService: GoogleApiService,
    private readonly dataSource: DataSource,
    private readonly logger: LogService,
  ) {}

  async uploadOne(
    questionId: string,
    dto: FileUploadDto,
    fileName: string,
    fileBuffer: Buffer,
  ) {
    let fileId = null;
    const random_uuid = randomUUID();

    const question = await this.dataSource.getRepository(Question).findOne({
      where: {
        id: questionId,
      },
    });
    if (!question) return [null, 'Cannot found question'];

    try {
      fileId = await this.googleApiService.uploadFileBuffer(
        random_uuid,
        fileBuffer,
      );
    } catch (err) {
      this.logger.error('UPLOAD FILE ON DRIVE: ' + err);
      return [null, 'Cannot upload file on drive: ' + err];
    }

    const shareableLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    const errorList = [];
    try {
      await this.templateRepository.insert({
        question: question,
        localPath:
          RodeConfig.TEMPLATE_LOCAL_PATH +
          '/' +
          question.stack.id +
          '/' +
          random_uuid +
          '.' +
          fileName.split('.').pop(),
        url: shareableLink,
        colorCode: dto.colorCode,
      });
      return ['Upload file successful', null];
    } catch (err) {
      this.logger.error('INSERT TEMPLATE: ' + err);
      errorList.push('Cannot insert template');
      // Delete uploaded file
      if (fileId) {
        await this.googleApiService.deleteFileById(fileId).catch(() => {
          this.logger.error('INSERT TEMPLATE: ' + err);
          errorList.push('Cannot delete uploaded template on drive!');
        });
      }
    }
    return [null, errorList];
  }
}
