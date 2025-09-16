import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Password for the user' })
  password: string;
  @ApiProperty({ example: 2, description: 'Role ID assigned to the user', required: false })
  roleId?: number;
}
