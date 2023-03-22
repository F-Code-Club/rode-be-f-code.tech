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
import { VirtualColumn } from '@decorators/virtual-column.decorator';

@Entity()
export class SubmitHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({
    type: 'enum',
    enum: ProgrammingLangEnum,
    default: ProgrammingLangEnum.C_CPP,
  })
  language: ProgrammingLangEnum;

  @Column()
  submissions: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column()
  time: number;

  @Column()
  space: number; // uses for both FE (count number of chars) and BE

  @VirtualColumn()
  totalScore: number;

  @VirtualColumn()
  totalTime: number;

  @VirtualColumn()
  totalSpace: number;

  @VirtualColumn()
  finishTime: Date;

  @ManyToOne(() => Account, (account) => account.submitHistory)
  account: Account;

  @ManyToOne(() => Question, (question) => question.submitHistory)
  question: Question;
}
