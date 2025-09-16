import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectsRepository.find({ relations: ['manager', 'transactions'] });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['manager', 'transactions'],
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create({
      name: dto.name,
      description: dto.description,
    });

    if (dto.managerId) {
      const manager = await this.usersRepository.findOneBy({ id: dto.managerId });
      if (!manager) throw new NotFoundException(`Manager ${dto.managerId} not found`);
      project.manager = manager;
    }

    return this.projectsRepository.save(project);
  }

  async update(id: number, dto: Partial<CreateProjectDto>): Promise<Project> {
    const project = await this.findOne(id);

    if (dto.name) project.name = dto.name;
    if (dto.description) project.description = dto.description;

    if (dto.managerId) {
      const manager = await this.usersRepository.findOneBy({ id: dto.managerId });
      if (!manager) throw new NotFoundException(`Manager ${dto.managerId} not found`);
      project.manager = manager;
    }

    return this.projectsRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }
}
