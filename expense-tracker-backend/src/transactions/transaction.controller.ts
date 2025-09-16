import { Controller, Get, Post, Body,Patch, Param, Put, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @Post()
  create(@Body() transaction: Transaction): Promise<Transaction> {
    return this.transactionsService.create(transaction);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() transaction: Transaction): Promise<Transaction> {
    return this.transactionsService.update(id, transaction);
  }
  @Patch(':id')
updatePartial(
  @Param('id') id: number,
  @Body() partialTransaction: Partial<Transaction>
): Promise<Transaction> {
  return this.transactionsService.updatePartial(+id, partialTransaction);
}


  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.transactionsService.remove(id);
  }
}
