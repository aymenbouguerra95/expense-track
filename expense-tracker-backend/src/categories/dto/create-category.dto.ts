import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Food', description: 'اسم التصنيف' })
  name: string;

  @ApiProperty({ example: 'Expenses related to food and dining', description: 'وصف التصنيف' })
  description: string;
}
