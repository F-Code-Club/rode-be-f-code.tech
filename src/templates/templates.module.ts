import { Module } from '@nestjs/common';
import { TemplateService } from './templates.service';
import { TemplateController } from '@templates/templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/templates.entity';
import { GoogleApiModule } from 'google-api/google-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([Template]), GoogleApiModule],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
