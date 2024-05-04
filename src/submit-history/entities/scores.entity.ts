import { Room } from '@rooms/entities/room.entity';
import { Team } from 'teams/entities/team.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubmitHistory } from './submit-history.entity';
@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Room, (room) => room.scores)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Room;
  @ManyToOne(() => Team, (team) => team.scores)
  @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
  team: Team;

  @Column({ name: 'total_score' })
  totalScore: number;
  @CreateDateColumn()
  lastSubmitTime: Date;

  @OneToMany(() => SubmitHistory, (submitHistory) => submitHistory.score, {
    nullable: false,
  })
  submitHistories: SubmitHistory[];
}
