import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
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
import { FileUploadDto, UpdateTemplateDto } from './dtos/file-upload.dto';
import { FileValidationPipe } from './upload-file.pipe';

@Controller('templates')
@ApiTags('Templates')
export class TemplateController {
  constructor(private readonly templatesService: TemplateService) {}

  @Get('/:question_id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async getTemplate(@Param('question_id') questionId: string) {
    const [data, err] = await this.templatesService.getOne(questionId);
    if (!data) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get Template Failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get Template Successful!',
      data,
      null,
    );
  }

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

  @Patch('color-code/:question_id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async updateColorCode(
    @Param('question_id') questionId: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    const [data, err] = await this.templatesService.updateColorCode(
      questionId,
      dto.colorCode,
    );
    if (!data) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update Color Code Failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Update Color Code Successful!',
      data,
      null,
    );
  }

  @Delete('/:question_id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async deleteTemplate(@Param('question_id') questionId: string) {
    const [result, errlist] = await this.templatesService.deleteOne(questionId);
    if (!result) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Delete Template Failed!',
        null,
        errlist,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Delete Template Successful!',
      result,
      errlist,
    );
  }
}
