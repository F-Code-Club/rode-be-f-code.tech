import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { QuestionStackStatus, RoomTypeEnum } from '@etc/enums';

@Entity('question_stacks')
export class QuestionStack {
  @PrimaryGeneratedColumn('uuid', {name: 'id'})
  id: number;
  @Column({name: 'stack_max', type: 'int', default: 1})
  stackMax: number;
  @Column({name: 'name', type: 'varchar', length: 128})
  name: string;
  @Column({name: 'status', type: "enum", default: QuestionStackStatus.DRAFT})
  status: QuestionStackStatus;
  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @Column({name: 'type', enum: RoomTypeEnum})
  type: RoomTypeEnum;
  @OneToMany(() => Question, (question) => question.stack)
  questions: Question[];
}