import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Food', description: 'اسم التصنيف' })
  name: string;

  @ApiProperty({ example: 'Expense', description: 'نوع التصنيف (Income أو Expense)' })
  type: string;
}
