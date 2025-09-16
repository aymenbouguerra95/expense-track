import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  period: string; // Monthly / Weekly / Yearly

  @ManyToOne(() => User, user => user.id, { nullable: true })
  user: User;

  @ManyToOne(() => Project, project => project.id, { nullable: true })
  project: Project;

  @ManyToOne(() => Category, category => category.id)
  category: Category;
}
