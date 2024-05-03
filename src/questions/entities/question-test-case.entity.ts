import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('test_cases')
export class QuestionTestCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  input: string;

  @Column()
  output: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;
}
