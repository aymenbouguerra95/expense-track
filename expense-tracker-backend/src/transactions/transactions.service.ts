import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({ relations: ['user', 'category', 'project', 'approvals'] });
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user', 'category', 'project', 'approvals'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return transaction;
  }

  create(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  async update(id: number, transaction: Transaction): Promise<Transaction> {
    await this.transactionRepository.update(id, transaction);
    return this.findOne(id);
  }

  // دالة جديدة لتحديث جزئي باستخدام PATCH
  async updatePartial(id: number, partialTransaction: Partial<Transaction>): Promise<Transaction> {
    const transaction = await this.findOne(id); // تأكد أن العنصر موجود
    Object.assign(transaction, partialTransaction); // دمج البيانات الجديدة
    return this.transactionRepository.save(transaction); // حفظ التغييرات
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
