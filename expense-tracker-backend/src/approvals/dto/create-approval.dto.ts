import { ApiProperty } from '@nestjs/swagger';
export class CreateApprovalDto {
  @ApiProperty()
  transactionId: number;
  @ApiProperty()
  approverId: number;
  @ApiProperty()
  status: string;
  @ApiProperty() // Pending / Approved / Rejected
  comment?: string;
  }
  