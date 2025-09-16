import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, user => user.id)
  manager: User;

  @OneToMany(() => Transaction, transaction => transaction.project)
  transactions: Transaction[];
}
