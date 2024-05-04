import { SubmitHistory } from '../../submit-history/entities/submit-history.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionTestCase } from './question-test-case.entity';
import { QuestionStack } from './question-stack.entity';
import { Template } from '@templates/entities/templates.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => QuestionStack, (stack) => stack.questions)
  @JoinColumn({ name: 'stack_id' })
  stack: QuestionStack;

  @Column({ name: 'max_submit_time', type: 'integer', default: 5 })
  maxSubmitTimes: number;

  @OneToOne(() => Template, (template) => template.question)
  template: Template;
  @OneToMany(
    () => QuestionTestCase,
    (questionTestCase) => questionTestCase.question,
    { onDelete: 'CASCADE' },
  )
  testCases: QuestionTestCase[];

  @OneToMany(() => SubmitHistory, (submitHistory) => submitHistory.question)
  submitHistory: SubmitHistory[];
}
