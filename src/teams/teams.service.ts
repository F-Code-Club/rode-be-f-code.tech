import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Member } from './entities/member.entity';
import { ExcelService } from 'excels/excels.service';
import { GoogleApiService } from 'google-api/google-api.service';
import { Account } from '@accounts/entities/account.entity';
import { RoleEnum } from '@etc/enums';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly excelsService: ExcelService,
    private readonly googleApiService: GoogleApiService,
    private readonly dataSource: DataSource
  ) { }
  async importTeamsFromGoogleForm(duplicateMode: number, fileId: string) {
    const [result, err] =
      await this.googleApiService.downloadTeamsRegisterSheetTemplate(fileId);
    if (!err) return [result, err];
    const resultExcel = await this.excelsService.readImportTeamExcel(result);
    for (const teamData of resultExcel) {
      const team = new Team();
      team.name = teamData.groupName;
      team.memberCount = teamData.member.length;
      team.members = teamData.member.map((memberData) => {
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
      try {
        await this.teamRepository.save(team);
      } catch (error) { }
    }
    return ['Load Success', null];
  }

  async importTeamsFromSheets(fileId: string) {
    const [result, err] = await this.googleApiService.getTeamsRegisterFromSheet(
      fileId,
    );
    if (err) return [null, err];

    const [resultExcel, errorList] =
      await this.excelsService.readImportTeamSheets(result);
    if (errorList.length > 0) errorList.push('');

    for (const teamData of resultExcel) {
      const team = new Team();
      team.name = teamData.groupName;
      team.memberCount = teamData.member.length;

      try {
        await this.dataSource.transaction(async manager => {
          for (const memberData of teamData.member) {
            const account = new Account();
            account.email = memberData.email;
            account.fullName = memberData.studentName;
            account.phone = memberData.phone;
            account.studentId = memberData.studentId;
            account.dob = memberData.dob;
            account.isEnabled = false;
            account.isLocked = false;
            account.role = RoleEnum.USER;

            const member = new Member();
            member.joinRoom = false;
            member.account = await manager.save(account);
            member.team = await manager.save(team);
            await manager.save(member);
          }
        });
      }
      catch (err) {
        errorList.push(
          'Error when saving TEAM[' +
          team.name +
          ']:  ' +
          err.message,
        );
      }
    }
    if (errorList.length == 0) return ['Import successful', errorList];
    return ['Import failed at some parts', errorList];
  }
}
