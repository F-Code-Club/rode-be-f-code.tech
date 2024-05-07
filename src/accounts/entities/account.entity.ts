import { RoleEnum } from '../../etc/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '../../teams/entities/member.entity';
@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;
  @Column({ name: 'student_id', unique: true, length: 24 })
  studentId: string;
  @Column({ name: 'full_name', type: 'varchar', length: 48 })
  fullName: string;

  @Column({ name: 'email', type: 'varchar', length: 30 })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 128, nullable: true })
  password: string;

  @Column({ name: 'phone', unique: true, type: 'varchar', length: 12 })
  phone: string;

  @Column({ name: 'dob', type: 'date' })
  dob: Date;

  @Column({
    name: 'role',
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    enumName: 'role_enum',
  })
  role: RoleEnum;

  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'date' })
  updatedAt: Date;

  @Column({ name: 'is_enabled', default: false })
  isEnabled: boolean;

  @Column({ name: 'is_locked', default: false })
  isLocked: boolean;

  @Column({ name: 'is_logged_in', default: false, select: false })
  isLoggedIn: boolean;

  @OneToOne(() => Member, (member) => member.account, { nullable: true })
  member: Member;
}
