import { Question } from 'questions/entities/question.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Question, (question) => question.template)
  @JoinColumn({name: 'question', referencedColumnName: 'id'})
  question: Question;

  @Column({name: 'local_path', type: 'varchar', length: 64})
  localPath: string;

  @Column({name: 'url', type: 'varchar', length: 64})
  url: string;
}
