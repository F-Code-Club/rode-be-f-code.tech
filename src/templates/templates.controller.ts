import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import ResponseObject from '@etc/response-object';
import { LocalFilesService } from './templates.service';
import { FileMimeTypeEnum, UploadFilePipe } from './upload-file.pipe';
import { Response } from 'express';
import { resolve } from 'path';

@Controller('local-files')
@ApiTags('LocalFiles')
export class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Get('file/:id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const [localFile, err] = await this.localFilesService.findOneById(id);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get file failed!',
        null,
        err,
      );
    }
    return res.sendFile(resolve(__dirname + '/../../' + localFile.path));
  }

  @Post('upload-question-file')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadQuestionFile(
    @UploadedFiles(
      new UploadFilePipe({
        allowedFileTypes: [
          FileMimeTypeEnum.GIF,
          FileMimeTypeEnum.JPEG,
          FileMimeTypeEnum.PNG,
          FileMimeTypeEnum.SVG,
        ],
        maxFileSize: 5 * 1024 * 1024,
        maxCount: 5,
        destination: 'uploads/question-files',
      }),
    )
    files: Express.Multer.File[],
  ) {
    const [localFiles, err] = await this.localFilesService.createMany(files);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Upload question file failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Upload question file success!',
      localFiles,
      null,
    );
  }
}
