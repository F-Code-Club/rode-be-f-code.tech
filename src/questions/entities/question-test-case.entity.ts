import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('test_cases')
export class QuestionTestCase {
  @PrimaryGeneratedColumn('identity', { name: 'id' })
  id: number;

  @Column()
  input: string;

  @Column()
  output: string;

  @ManyToOne(() => Question, (question) => question.id, { onDelete: 'CASCADE', nullable: false})
  @JoinColumn({name: 'question_id'})
  question: Question;
}
