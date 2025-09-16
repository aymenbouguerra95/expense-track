import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from './approval.entity';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval)
    private approvalsRepository: Repository<Approval>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Approval[]> {
    return this.approvalsRepository.find({ relations: ['transaction', 'approver'] });
  }

  async findOne(id: number): Promise<Approval> {
    const approval = await this.approvalsRepository.findOne({
      where: { id },
      relations: ['transaction', 'approver'],
    });
    if (!approval) throw new NotFoundException(`Approval ${id} not found`);
    return approval;
  }

  async create(dto: CreateApprovalDto): Promise<Approval> {
    const approval = new Approval();

    const transaction = await this.transactionsRepository.findOneBy({ id: dto.transactionId });
    if (!transaction) throw new NotFoundException(`Transaction ${dto.transactionId} not found`);

    const approver = await this.usersRepository.findOneBy({ id: dto.approverId });
    if (!approver) throw new NotFoundException(`User ${dto.approverId} not found`);

    approval.transaction = transaction;
    approval.approver = approver;
    approval.status = dto.status;
    approval.comment = dto.comment;
    approval.date = new Date();

    return this.approvalsRepository.save(approval);
  }

  async remove(id: number): Promise<void> {
    await this.approvalsRepository.delete(id);
  }
}
