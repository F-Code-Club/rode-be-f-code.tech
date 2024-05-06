import { Module } from '@nestjs/common';
import { ExcelService } from './excels.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
