import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { QuestionStackStatus, RoomTypeEnum } from '@etc/enums';
import { Room } from '@rooms/entities/room.entity';
@Entity('question_stacks')
@Check(`"stack_max" >= 1`)
export class QuestionStack {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;
  @Column({ name: 'stack_max', type: 'integer', default: 1 })
  stackMax: number;
  @Column({ name: 'name', type: 'varchar', length: 128 })
  name: string;
  @Column({
    name: 'status',
    type: 'enum',
    enum: QuestionStackStatus,
    default: QuestionStackStatus.DRAFT,
    enumName: 'question_stack_status_enum',
  })
  status: QuestionStackStatus;
  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;
  @Column({
    name: 'type',
    type: 'enum',
    enum: RoomTypeEnum,
    enumName: 'type_enum',
  })
  type: RoomTypeEnum;
  @OneToMany(() => Question, (question) => question.stack)
  questions: Question[];
  @OneToOne(() => Room, (room) => room.questionStack, { nullable: true })
  room?: Room;
}
