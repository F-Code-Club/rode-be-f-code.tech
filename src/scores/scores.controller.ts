import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@Controller('submit-history')
@UseGuards(JwtAuthGuard)
@ApiTags('ScoreHistory')
@ApiBearerAuth()
export class ScoresController {}
