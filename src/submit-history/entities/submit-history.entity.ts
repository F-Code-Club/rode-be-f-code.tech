import { Account } from '../../accounts/entities/account.entity';
import { Question } from '../../rooms/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProgrammingLangEnum } from '../../etc/enums';

@Entity()
export class SubmitHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({
    type: 'enum',
    enum: ProgrammingLangEnum,
    nullable: true,
  })
  language: ProgrammingLangEnum;

  @Column({ type: 'text' })
  submissions: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ nullable: true })
  time: number;

  @Column({ nullable: true })
  space: number; // uses for both FE (count number of chars) and BE

  @ManyToOne(() => Account, (account) => account.submitHistory)
  account: Account;

  @ManyToOne(() => Question, (question) => question.submitHistory)
  question: Question;

  constructor(
    account: Account,
    question: Question,
    submissions: string,
    language: ProgrammingLangEnum,
  ) {
    this.account = account;
    this.question = question;
    this.submissions = submissions;
    this.language = language;
  }
}
