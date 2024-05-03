import { Module } from '@nestjs/common';
import { TemplateService } from './templates.service';
import { LocalFilesController } from './templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/templates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [LocalFilesController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class LocalFilesModule {}
