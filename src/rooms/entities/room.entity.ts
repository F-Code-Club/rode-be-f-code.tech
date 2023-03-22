import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomTypeEnum } from '../../etc/enums';
import { Question } from './question.entity';
import { UserRoom } from '../../user-rooms/entities/user-room.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  openTime: Date;

  @Column({ nullable: true })
  closeTime: Date;

  @Column({ nullable: true })
  duration: number;

  @Column({ type: 'enum', enum: RoomTypeEnum })
  type: RoomTypeEnum;

  @OneToMany(() => Question, (question) => question.room, {
    cascade: true,
  })
  questions: Question[];

  @Column({ default: false })
  isPrivate: boolean;

  @OneToMany(() => UserRoom, (userRooms) => userRooms.room)
  userRooms: UserRoom[];

  @CreateDateColumn()
  createdAt: Date;
}
