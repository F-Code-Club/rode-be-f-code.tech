import { Controller, UseGuards } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Controller('Question Controller')
@ApiTags('Accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
}
