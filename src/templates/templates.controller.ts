import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TemplateService } from './templates.service';
import { RoleEnum } from '@etc/enums';
import Roles from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RoleGuard } from '@auth/role.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import ResponseObject from '@etc/response-object';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { FileUploadDto } from './dtos/file-upload.dto';

@Controller('templates')
@ApiTags('Templates')
export class TemplateController {
  constructor(private readonly templatesService: TemplateService) {}

  @Post('upload/:question_id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Template File',
    type: FileUploadDto,
  })
  async uploadFile(
    @Param('question_id') questionId: string,
    @Body() dto: FileUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Upload Template Failed!',
        null,
        'File is empty',
      );
    const [data, errlist] = await this.templatesService.uploadOne(
      questionId,
      dto,
      file.originalname,
      file.buffer,
    );
    if (!data) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Upload Template Failed!',
        data,
        errlist,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Upload Template Successful!',
      data,
      null,
    );
  }
}
