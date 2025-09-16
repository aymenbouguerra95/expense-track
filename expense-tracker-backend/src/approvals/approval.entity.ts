import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';

@Entity()
export class Approval {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, transaction => transaction.approvals)
  transaction: Transaction;

  @Column()
  status: string; // Pending / Approved / Rejected

  @ManyToOne(() => User, user => user.id)
  approver: User;

  @Column({ nullable: true })
  comment?: string;

  @Column()
  date: Date;
}
