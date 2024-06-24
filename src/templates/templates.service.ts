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
import { TemplatesUtils } from './templates.utils';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    private readonly googleApiService: GoogleApiService,
    private readonly dataSource: DataSource,
    private readonly logger: LogService,
  ) {}

  async getOne(questionId: string) {
    const template = await this.templateRepository
      .findOne({
        where: {
          question: {
            id: questionId,
          },
        },
      })
      .catch((err) => {
        this.logger.error('FIND TEMPLATE: ' + err);
      });

    if (!template) return [null, 'Cannot find template'];
    return [template, null];
  }

  async uploadOne(
    questionId: string,
    dto: FileUploadDto,
    file: Express.Multer.File,
  ) {
    let fileId = null;
    const random_uuid = randomUUID();
    const question = await this.dataSource
      .getRepository(Question)
      .findOne({
        where: {
          id: questionId,
        },
      })
      .catch((error) => {
        this.logger.error('FIND QUESTION: ' + error);
      });
    if (!question) return [null, 'Cannot find question'];

    try {
      fileId = await this.googleApiService.uploadFileBuffer(
        random_uuid,
        file.buffer,
      );
    } catch (err) {
      this.logger.error('UPLOAD FILE ON DRIVE: ' + err);
      return [null, 'Cannot upload file on drive: ' + err];
    }

    const shareableLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    const errorList = [];
    try {
      const template = await this.templateRepository.save({
        question: question,
        localPath:
          RodeConfig.TEMPLATE_LOCAL_PATH +
          '/' +
          question.stack.id +
          '/' +
          random_uuid +
          '.' +
          file.originalname.split('.').pop(),
        url: shareableLink,
        colorCode: dto.colorCode,
      });
      return [template, null];
    } catch (err) {
      this.logger.error('INSERT TEMPLATE: ' + err);
      errorList.push(
        'Cannot insert template, maybe this question has had a template',
      );
      // Delete uploaded file
      if (fileId) {
        await this.googleApiService.deleteFileById(fileId).catch(() => {
          this.logger.error('DELETE FILE ON DRIVE: ' + err);
          errorList.push('Cannot delete uploaded template on drive!');
        });
      }
    }
    return [null, errorList];
  }

  async updateColorCode(questionId: string, colorCode: string) {
    const template = await this.templateRepository
      .findOne({
        where: {
          question: {
            id: questionId,
          },
        },
      })
      .catch((err) => {
        this.logger.error('FIND TEMPLATE: ' + err);
      });
    if (!template) return [null, 'Cannot find template'];

    try {
      template.colorCode = colorCode;
      const updatedTemplate = await this.templateRepository.save(template);
      return [updatedTemplate, null];
    } catch (err) {
      this.logger.error('UPDATE TEMPLATE: ' + err);
    }
    return [null, 'Cannot update template'];
  }

  async deleteOne(questionId: string) {
    let error = null;
    const template = await this.templateRepository
      .findOne({
        where: {
          question: {
            id: questionId,
          },
        },
      })
      .catch((err) => {
        this.logger.error('FIND TEMPLATE: ' + err);
      });
    if (!template) return [null, 'Cannot find template'];

    const fileId = TemplatesUtils.extractFileId(template.url);
    if (fileId) {
      await this.googleApiService.deleteFileById(fileId).catch((err) => {
        this.logger.error('DELETE FILE ON DRIVE: ' + err);
        error = 'Cannot delete file on drive!';
      });
    } else {
      error = 'File id not found';
    }
    if (!error) {
      try {
        await this.templateRepository.remove(template);
        return [true, error];
      } catch (err) {
        this.logger.error('DELETE TEMPLATE: ' + err);
        error = 'Cannot delete template';
      }
    }
    return [null, error];
  }
}
