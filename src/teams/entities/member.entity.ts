import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Team } from './team.entity';
import { SubmitHistory } from 'submit-history/entities/submit-history.entity';
@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn('identity', { name: 'id' })
  id: number;
  @ManyToOne(() => Team, (team) => team.members, {nullable: false})
  @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
  team: Team;
  @OneToOne(() => Account, (account) => account.member, { nullable: false })
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;
  @Column({ name: 'has_join_room', default: false })
  joinRoom: boolean;
  @OneToMany(() => SubmitHistory, (submitHistory) => submitHistory.member, {
    nullable: true,
  })
  submitHistory: SubmitHistory[];
}
