import { Controller, Get, Post, Patch, Body, Param, Delete, UnauthorizedException, Req,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('Admin') 
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Manager', 'Employee')
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req): Promise<User> {
  const user = await this.usersService.findOne(+id);

  // إذا المستخدم Employee، يتحقق أنه يشوف فقط بياناته
  if (req.user.role === 'Employee' && req.user.userId !== user.id) {
    throw new UnauthorizedException('غير مسموح لك رؤية بيانات المستخدم هذا');
  }

  return user;
}


  @UseGuards(JwtAuthGuard)
  @Post() 
  @Roles('Admin')
  async create(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    const saved = await this.usersService.create(createUserDto);
    const { password, ...safe } = saved as any;
    return safe;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Roles('Admin')
  updatePartial(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updatePartial(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(+id);
  }
}


