import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Member } from './entities/member.entity';
import { TeamController } from './teams.controller';
import { AccountsModule } from '@accounts/accounts.module';
import { TeamService } from './teams.service';
import { ExcelModule } from 'excels/excels.module';
import { GoogleApiModule } from 'google-api/google-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, Member]),
    AccountsModule,
    ExcelModule,
    GoogleApiModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamsModule {}
