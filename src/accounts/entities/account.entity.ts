import { RoleEnum } from '../../etc/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoom } from '../../user-rooms/entities/user-room.entity';
import { SubmitHistory } from '../../submit-history/entities/submit-history.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fname: string;

  @Column()
  lname: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  studentId: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  dob: Date;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserRoom, (userRooms) => userRooms.account)
  userRooms: UserRoom[];

  @OneToMany(() => SubmitHistory, (submitHistory) => submitHistory.account)
  submitHistory: SubmitHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false, select: false })
  isLoggedIn: boolean;
}
