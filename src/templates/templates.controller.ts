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
import { FileValidationPipe } from './upload-file.pipe';

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
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    const [data, errlist] = await this.templatesService.uploadOne(
      questionId,
      dto,
      file,
    );
    if (!data) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Upload Template Failed!',
        null,
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
