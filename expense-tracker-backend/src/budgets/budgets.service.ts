import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Budget[]> {
    return this.budgetsRepository.find({ relations: ['user', 'project', 'category'] });
  }

  async findOne(id: number): Promise<Budget> {
    const budget = await this.budgetsRepository.findOne({
      where: { id },
      relations: ['user', 'project', 'category'],
    });
    if (!budget) throw new NotFoundException(`Budget with ID ${id} not found`);
    return budget;
  }

  async create(dto: CreateBudgetDto): Promise<Budget> {
    const budget = new Budget();
    budget.amount = dto.amount;
    budget.period = dto.period;

    if (dto.userId) {
      const user = await this.usersRepository.findOneBy({ id: dto.userId });
      if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
      budget.user = user;
    }

    if (dto.projectId) {
      const project = await this.projectsRepository.findOneBy({ id: dto.projectId });
      if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);
      budget.project = project;
    }

    const category = await this.categoriesRepository.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);
    budget.category = category;

    return this.budgetsRepository.save(budget);
  }

  async update(id: number, dto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.budgetsRepository.findOneBy({ id });
    if (!budget) throw new NotFoundException(`Budget with ID ${id} not found`);

    if (dto.amount) budget.amount = dto.amount;
    if (dto.period) budget.period = dto.period;

    if (dto.userId) {
      const user = await this.usersRepository.findOneBy({ id: dto.userId });
      if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
      budget.user = user;
    }

    if (dto.projectId) {
      const project = await this.projectsRepository.findOneBy({ id: dto.projectId });
      if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);
      budget.project = project;
    }

    if (dto.categoryId) {
      const category = await this.categoriesRepository.findOneBy({ id: dto.categoryId });
      if (!category) throw new NotFoundException(`Category ${dto.categoryId} not found`);
      budget.category = category;
    }

    return this.budgetsRepository.save(budget);
  }

  async remove(id: number): Promise<void> {
    const result = await this.budgetsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
  }
}
