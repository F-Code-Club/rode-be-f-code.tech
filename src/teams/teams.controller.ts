import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from './teams.service';

@Controller('team-controller')
@UseGuards(JwtAuthGuard)
@ApiTags('Team Controller')
@ApiBearerAuth()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
}
