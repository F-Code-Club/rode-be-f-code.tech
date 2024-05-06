import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Controller, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TeamService } from './teams.service';
import ResponseObject from '@etc/response-object';

@Controller('team-controller')
@UseGuards(JwtAuthGuard)
@ApiTags('Team Controller')
@ApiBearerAuth()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Post('excels/import/:fileId')
  async importUsersInGoogleForm (@Param('fileId') fileId: string, @Query('duplicateOption') duplicateOption?: number){
    const [result,err] = await this.teamService.importTeamsFromGoogleForm(duplicateOption, fileId);
    if(!err) return new ResponseObject(
      HttpStatus.BAD_REQUEST,
      'Import Teams By Excel Failed',
      null,
      err
    )
    return new ResponseObject(
      HttpStatus.OK,
      'Import Teams By Excel Success',
      result,
      err
    )
  }
}
