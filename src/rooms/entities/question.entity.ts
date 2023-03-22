import { SubmitHistory } from '../../submit-history/entities/submit-history.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionTestCase } from './question-test-case.entity';
import { Room } from './room.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionImage: string;

  @Column({ nullable: true })
  maxSubmitTimes: number;

  @Column({ nullable: true })
  colors: string;

  @Column({ type: 'text', nullable: true })
  codeTemplate: string;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  room: Room;

  @OneToMany(
    () => QuestionTestCase,
    (questionTestCase) => questionTestCase.question,
    { cascade: true },
  )
  testCases: QuestionTestCase[];

  @OneToMany(() => SubmitHistory, (submitHistory) => submitHistory.question)
  submitHistory: SubmitHistory[];
}
