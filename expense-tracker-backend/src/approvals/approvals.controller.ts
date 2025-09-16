import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { Approval } from './approval.entity';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Approvals')
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  findAll(): Promise<Approval[]> {
    return this.approvalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Approval> {
    return this.approvalsService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateApprovalDto): Promise<Approval> {
    return this.approvalsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.approvalsService.remove(+id);
  }
}
