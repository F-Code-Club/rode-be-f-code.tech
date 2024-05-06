import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Member } from './entities/member.entity';
import { ExcelService } from 'excels/excels.service';
import { GoogleApiService } from 'google-api/google-api.service';
import { Account } from '@accounts/entities/account.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly excelsService: ExcelService,
    private readonly googleApiService: GoogleApiService,
  ) {}
  async importTeamsFromGoogleForm(duplicateMode: number, fileId: string){
    const [result, err] = await this.googleApiService.downloadTeamsRegisterSheetTemplate(fileId);
    if(!err) return [result, err];
    const resultExcel = await this.excelsService.readImportTeamExcel(result);
    for (const teamData of resultExcel) {
      const team = new Team();
      team.name = teamData.groupName;
      team.memberCount = teamData.member.length;
      team.members = teamData.member.map(memberData => {
        const account = new Account();
        account.email = memberData.email;
        account.fullName = memberData.studentName;
        account.phone = memberData.phone;
        account.studentId = memberData.studentId;
        const member = new Member();
        member.joinRoom = false;
        member.team = team;
        account.member = member;
        member.account = account;
        return member;
      });
      try{
        await this.teamRepository.save(team);
      }catch(error){}
    }
    return ["Load Success", null];
  }
}
