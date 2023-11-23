import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtPayloadService } from '../../common/service/jwt.payload.service';
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly jwtPayloadService: JwtPayloadService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.save(createUserDto);

    const perfil = await this.profileRepository.save({
      userId: user.id,
      description: 'default',
    });

    const token = await this.jwtPayloadService.createJwtPayload(user);

    const response = {
      ...user,
      perfil,
    };

    return response;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(@Param('id') id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuario no se encuentra');
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role', 'verified'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update({ id }, updateUserDto);

    if (user.affected === 0) {
      throw new NotFoundException('Usuario no se encuentra');
    }

    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository.softDelete({ id });
    // const user = await this.userRepository.softRemove({id});

    if (!user) {
      throw new NotFoundException('Usuario no se encuentra');
    }

    return user;
  }
}
