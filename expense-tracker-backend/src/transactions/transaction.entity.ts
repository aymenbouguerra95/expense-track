import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Project } from '../projects/project.entity';
import { Approval } from '../approvals/approval.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  type: string; // Income / Expense

  @Column({ nullable: true })
  note: string;

  @Column()
  date: Date;

  @ManyToOne(() => User, user => user.transactions)
  user: User;

  @ManyToOne(() => Category, category => category.transactions)
  category: Category;

  @ManyToOne(() => Project, project => project.transactions, { nullable: true })
  project: Project;

  @OneToMany(() => Approval, approval => approval.transaction)
  approvals: Approval[];
}
