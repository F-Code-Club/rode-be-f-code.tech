import { Account } from '../../accounts/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

@Entity()
export class UserRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.userRooms)
  account: Account;

  @ManyToOne(() => Room, (room) => room.userRooms)
  room: Room;

  @CreateDateColumn()
  joinTime: Date;

  @Column({ nullable: true })
  finishTime: Date;

  @Column({ default: false, select: false })
  attendance: boolean;
}
