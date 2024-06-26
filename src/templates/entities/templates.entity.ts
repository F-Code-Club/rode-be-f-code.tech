import { Question } from 'questions/entities/question.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @OneToOne(() => Question, (question) => question.template, {
    nullable: false,
  })
  @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
  question: Question;

  @Column({ name: 'local_path', type: 'varchar', length: 128 })
  localPath: string;

  @Column({ name: 'url', type: 'varchar', length: 128 })
  url: string;

  @Column({ name: 'color_code', type: 'varchar', length: 128, nullable: true })
  colorCode: string;
}
