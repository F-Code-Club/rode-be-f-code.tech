import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/templates.entity';
import { GoogleApiService } from 'google-api/google-api.service';
import { QuestionService } from '@questions/questions.service';
import { FileUploadDto } from './dtos/file-upload.dto';
import RodeConfig from '@etc/config';
import { LogService } from '@logger/logger.service';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    private readonly questionService: QuestionService,
    private readonly googleApiService: GoogleApiService,
    private readonly logger: LogService,
  ) {}

  async uploadOne(
    questionId: string,
    dto: FileUploadDto,
    fileName: string,
    fileBuffer: Buffer,
  ) {
    let fileId = null;
    const question = await this.questionService.getQuestionById(questionId);

    if (!question) return [null, 'Cannot found question'];

    try {
      fileId = await this.googleApiService.uploadFileBuffer(
        fileName,
        fileBuffer,
      );
    } catch (err) {
      this.logger.error('UPLOAD FILE ON DRIVE: ' + err);
      return [null, 'Cannot upload file on drive'];
    }

    const shareableLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    let errorList = [];
    try {
      await this.templateRepository.insert({
        question: question,
        localPath: RodeConfig.TEMPLATE_LOCAL_PATH,
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
