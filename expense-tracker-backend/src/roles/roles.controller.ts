import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Role> {
    return this.rolesService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = dto.name;
    return this.rolesService.create(role);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() partialRole: Partial<Role>): Promise<Role> {
    return this.rolesService.update(+id, partialRole);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.rolesService.remove(+id);
  }
}
