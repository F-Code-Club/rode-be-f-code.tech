import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('local-files')
@ApiTags('LocalFiles')
export class LocalFilesController {
  constructor() {}
}
