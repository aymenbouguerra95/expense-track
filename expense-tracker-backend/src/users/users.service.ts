import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['transactions', 'role'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['transactions', 'role'],
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'transactions'],
    });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    // optional: منع تكرار الإيميل بشكل أبسط
    const exists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already in use');
  
    let role: Role | null = null;
    if (dto.roleId) {
      role = await this.rolesRepository.findOne({ where: { id: dto.roleId } });
      if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);
    }
  
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
  
    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(dto.password, salt);
  
    if (role) user.role = role;
  
    return this.userRepository.save(user);
  }
  

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.roleId) {
      const role = await this.rolesRepository.findOneBy({ id: dto.roleId });
      if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);
      user.role = role;
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(dto.password, salt);
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async updatePartial(id: number, dto: Partial<UpdateUserDto>): Promise<User> {
    const user = await this.findOne(id);

    if (dto.roleId) {
      const role = await this.rolesRepository.findOneBy({ id: dto.roleId });
      if (!role) throw new NotFoundException(`Role ${dto.roleId} not found`);
      user.role = role;
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(dto.password, salt);
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
