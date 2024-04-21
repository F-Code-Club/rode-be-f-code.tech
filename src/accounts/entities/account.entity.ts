import { RoleEnum } from '../../etc/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoom } from '../../user-rooms/entities/user-room.entity';
import { SubmitHistory } from '../../submit-history/entities/submit-history.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  dob: Date;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @OneToMany(() => UserRoom, (userRooms) => userRooms.account)
  userRooms: UserRoom[];

  @OneToMany(() => SubmitHistory, (submitHistory) => submitHistory.account)
  submitHistory: SubmitHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ default: false, select: false })
  isLoggedIn: boolean;
}
