import { Room } from '@rooms/entities/room.entity';
import { Team } from 'teams/entities/team.entity';
import {
  Check,
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
@Check(`"total_score" >= 0`)
export class Score {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Room, (room) => room.scores)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Room;

  @ManyToOne(() => Team, (team) => team.scores)
  @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
  team: Team;

  @Column({ name: 'total_score', type: 'integer', unsigned: true, default: 0 })
  totalScore: number;

  @CreateDateColumn({ name: 'last_submit_time', type: 'timestamp' })
  lastSubmitTime: Date;

  @Column({ name: 'penalty', type: 'integer', unsigned: true, default: 0 })
  penalty: number;

  @OneToMany(() => SubmitHistory, (submitHistory) => submitHistory.score, {
    nullable: false,
  })
  submitHistories: SubmitHistory[];
}
