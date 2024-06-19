import { Question } from '../../questions/entities/question.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ProgrammingLangEnum } from '@etc/enums';
import { Member } from 'teams/entities/member.entity';
import { Score } from 'scores/entities/scores.entity';

@Entity('submit_histories')
@Check(`"submit_number" >= 1`)
@Check(`"run_time" >= 0`)
@Check(`"score" >= 0`)
@Check(`"character_count" >= 0`)
export class SubmitHistory {
  @PrimaryColumn({ name: 'score_id' })
  scoreId: string;
  @PrimaryColumn({ name: 'question_id' })
  questionId: string;
  @PrimaryColumn({ name: 'member_id' })
  memberId: number;

  @ManyToOne(() => Score, (score) => score.submitHistories)
  @JoinColumn({ name: 'score_id', referencedColumnName: 'id' })
  score: Score;

  @ManyToOne(() => Question, (question) => question.submitHistory)
  @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
  question: Question;

  @ManyToOne(() => Member, (member) => member.submitHistory)
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member: Member;

  @Column({
    name: 'submit_number',
    type: 'integer',
    default: 1,
    primary: true,
    nullable: false,
  })
  submitNumber: number;

  @Column({ name: 'run_time', type: 'integer', unsigned: true, nullable: true })
  runTime: number;

  @Column({ name: 'score', type: 'integer', unsigned: true })
  scoreSubmit: number;

  @Column({
    type: 'enum',
    enum: ProgrammingLangEnum,
    name: 'language',
    enumName: 'programming_lang_enum',
  })
  language: ProgrammingLangEnum;

  @Column({ name: 'character_count', type: 'integer' })
  characterCount: number; // uses for both FE (count number of chars) and BE

  @CreateDateColumn({ name: 'last_submit_time', type: 'timestamp' })
  lastSubmitTime: Date;

  @Column({ name: 'submissions', type: 'text' })
  submissions: string;

  constructor(
    member: Member,
    question: Question,
    submissions: string,
    language: ProgrammingLangEnum,
  ) {
    this.member = member;
    this.question = question;
    this.submissions = submissions;
    this.language = language;
  }
}
