import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User  } from './user.entity';


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
  }

  async create(email: string, password: string) {
    const user = await this.repo.create({email, password});
    return this.repo.save(user);
  }

  async findOne(id: number) {
    if(!id) {
      throw new BadRequestException('Invalid user Id, can\'t find the user')
    }
    const user = await this.repo.findOneBy({id});
    return user;
  }

  async find(email: string) {
    const users = await this.repo.find({
      where: {email}
    });
    return users;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOneBy({id});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    const save = await this.repo.save(user);
    return save;
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({id});
    if (!user) {
      throw new NotFoundException('User does not exist');
    } 
    const del = await this.repo.remove(user);
    return del;
  }

}
