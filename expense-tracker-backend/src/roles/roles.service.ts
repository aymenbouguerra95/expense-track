import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ['users'] });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id }, relations: ['users'] });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return role;
  }

  create(role: Role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async update(id: number, partialRole: Partial<Role>): Promise<Role> {
    await this.rolesRepository.update(id, partialRole);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.rolesRepository.delete(id);
  }
}
