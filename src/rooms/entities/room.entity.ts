import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomTypeEnum } from '../../etc/enums';
import { Score } from 'submit-history/entities/scores.entity';
import { QuestionStack } from '@questions/entities/question-stack.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'code', unique: true })
  code: string;

  @OneToOne(() => QuestionStack, (questionStack) => questionStack.room)
  @JoinColumn({ name: 'stack_id' })
  questionStack: QuestionStack;

  @Column({ name: 'size', type: 'integer', default: 1 })
  size: number;
  @Column({ type: 'enum', enum: RoomTypeEnum })
  type: RoomTypeEnum;

  @Column({ name: 'open_time' })
  openTime: Date;

  @Column({ name: 'close_time' })
  closeTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: false, name: 'is_privated' })
  isPrivate: boolean;

  @OneToMany(() => Score, (score) => score.room, { nullable: true })
  scores?: Score[];
}
