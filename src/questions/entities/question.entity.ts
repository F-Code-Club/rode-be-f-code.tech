import { SubmitHistory } from '../../submit-history/entities/submit-history.entity';
import {
  Check,
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
import { Exclude } from 'class-transformer';
@Entity('questions')
@Check(`"score" >= 0`)
@Check(`"max_submit_time" >= 0`)
export class Question {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => QuestionStack, (stack) => stack.questions, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stack_id' })
  @Exclude()
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
  @Exclude()
  testCases: QuestionTestCase[];

  @Column({ name: 'score', type: 'integer', unsigned: true, default: 0 })
  score: number;

  @OneToMany(() => SubmitHistory, (submitHistory) => submitHistory.question)
  @Exclude()
  submitHistory: SubmitHistory[];
}
