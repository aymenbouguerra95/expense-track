import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ApprovalsModule } from './approvals/approvals.module';

// Import Entities
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Transaction } from './transactions/transaction.entity';
import { Category } from './categories/category.entity';
import { Project } from './projects/project.entity';
import { Budget } from './budgets/budget.entity';
import { Approval } from './approvals/approval.entity';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [
    // Database connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin', // غيرها حسب جهازك
      database: 'expense_tracker',
      entities: [User, Role, Transaction, Category, Project, Budget, Approval],
      synchronize: true, // فقط للتطوير، لا تستخدمه في الإنتاج
    }),
    // Modules
    UsersModule,
    RolesModule,
    TransactionsModule,
    CategoriesModule,
    ProjectsModule,
    BudgetsModule,
    ApprovalsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
