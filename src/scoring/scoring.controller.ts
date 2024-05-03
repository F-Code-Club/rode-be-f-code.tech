import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('scoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Scoring')
export class ScoringController {
  constructor() {}
}
