import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { Budget } from './budget.entity';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Category } from '../categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, User, Project, Category])],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}
