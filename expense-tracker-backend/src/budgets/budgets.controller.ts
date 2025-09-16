import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  findAll(): Promise<Budget[]> {
    return this.budgetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Budget> {
    return this.budgetsService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateBudgetDto): Promise<Budget> {
    return this.budgetsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateBudgetDto): Promise<Budget> {
    return this.budgetsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.budgetsService.remove(+id);
  }
}
