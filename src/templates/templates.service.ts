import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Template } from './entities/templates.entity';
import { GoogleApiService } from 'google-api/google-api.service';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    private readonly googleApiService: GoogleApiService,
    private readonly dataSource: DataSource,
  ) {}

  async uploadOne(questionId: string, fileName: string, fileBuffer: Buffer) {
    let errorList = [];
    const template = await this.templateRepository
      .createQueryBuilder('templates')
      .where('templates.question_id = :questionId', { questionId })
      .getOne();
    if (!template) {
      errorList.push('Cannot found template to upload');
      return [null, errorList];
    }
    const oldUrl = template.url;
    let uploadFileId = null;
    try {
      await this.dataSource.transaction(async (manager) => {
        uploadFileId = await this.googleApiService.uploadTemplate(
          fileName,
          fileBuffer,
        );
        template.url = uploadFileId;
        await manager.save(template);
        //Delete old file on drive
        if (oldUrl) {
          await this.googleApiService
            .deleteFileById(oldUrl)
            .catch(() =>
              errorList.push('Cannot delete old template on drive!'),
            );
        }
      });
      return ['Upload successful', errorList];
    } catch (err) {
      errorList.push(err.message);
      //Delete uploaded file
      if (uploadFileId)
        await this.googleApiService
          .deleteFileById(uploadFileId)
          .catch(() =>
            errorList.push('Cannot delete uploaded template  on drive!'),
          );
    }
    return [null, errorList];
  }

  // async uploadAll() {
  //   let errorList: string[] = [];
  //   const templateList: Template[] = await this.templateRepository.find({});
  //   if (templateList) {
  //     templateList.forEach(async (template) => {
  //       try {
  //         const res = await this.googleApiService.uploadTemplate(template.localPath);
  //       } catch (err) {
  //         errorList.push('Error when upload template: ' + err.message);
  //       }
  //     });
  //   } else errorList.push('There are no template to upload');
  //   return [true, errorList];
  // }
}
