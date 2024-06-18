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

  @Column({ default: false, name: 'is_visiable' })
  isVisible: boolean;

  @ManyToOne(() => Question, (question) => question.id, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
