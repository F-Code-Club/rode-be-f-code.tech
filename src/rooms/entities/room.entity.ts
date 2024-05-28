import {
  Check,
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
@Check(`"size" >= 1`)
@Check(`"open_time" <= "close_time"`)
export class Room {
  @PrimaryGeneratedColumn('identity', { name: 'id' })
  id: number;

  @Column({ name: 'code', unique: true })
  code: string;

  @OneToOne(() => QuestionStack, (questionStack) => questionStack.room, {
    nullable: false,
  })
  @JoinColumn({ name: 'stack_id' })
  questionStack: QuestionStack;

  @Column({ name: 'size', type: 'integer', default: 1 })
  size: number;
  @Column({
    type: 'enum',
    enum: RoomTypeEnum,
    name: 'type',
    enumName: 'type_enum',
  })
  type: RoomTypeEnum;

  @Column({ name: 'open_time', type: 'timestamp' })
  openTime: Date;

  @Column({ name: 'close_time', type: 'timestamp' })
  closeTime: Date;

  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;

  @Column({ default: true, name: 'is_privated' })
  isPrivate: boolean;

  @OneToMany(() => Score, (score) => score.room, { nullable: true })
  scores?: Score[];
}
