import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  period: string;

  @ApiProperty()
  userId?: number;

  @ApiProperty()
  projectId?: number;

  @ApiProperty()
  categoryId: number;
}
