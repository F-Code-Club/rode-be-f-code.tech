import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Controller('Question Controller')
@ApiTags('Accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Get('stacks/:id')
  async findOneStack(@Param('id') stackId){
    
  }

  @Get('stacks')
  async getAllStackActive(@Query('active') isActive?:boolean){
  }
}
