import { Module } from '@nestjs/common';
import { TemplateService } from './templates.service';
import { TemplateController } from '@templates/templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/templates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
