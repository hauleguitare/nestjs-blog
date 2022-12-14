import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { RoleEntity } from 'src/entities/role.entity';
import { UserEntity } from 'src/entities/user.entity';
import { NotFoundEntityException } from 'src/exceptions/entity.exception';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/create-user.dto';
import { UserDto } from './models/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .getMany();
    return users.map((user) => plainToClass(UserDto, user));
  }

  async findOne(uid: string): Promise<UserDto> {
    const user = await this.findById(uid);
    return plainToClass(UserDto, user);
  }

  async findById(uid: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({
      where: { uid },
      relations: { roles: true },
    });
    if (!user) {
      throw new NotFoundEntityException('users', uid);
    }
    return user;
  }

  async findUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserEntity | null> {
    const user = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.username = :username', { username: usernameOrEmail })
      .orWhere('user.email = :email', { email: usernameOrEmail })
      .getOne();
    return user;
  }

  async updateTimeLogin(userId: string, time: Date) {
    const result = await this.userRepo
      .createQueryBuilder()
      .update()
      .set({ lastLogin: time })
      .where('users.uid = :uid', { uid: userId })
      .execute();
    if (result.affected === 0) {
      throw new Error('can not update time field user');
    }
  }

  async createUser(userData: CreateUserDto): Promise<UserDto> {
    const newUser = this.userRepo.create(userData);
    const newRole = new RoleEntity();

    const [passwordHash, salt] = await this.genPasswordHash(userData.password);
    newUser.passwordHash = passwordHash;
    newUser.passwordSalt = salt;
    newUser.roles = [newRole];

    const user = await this.userRepo.save(newUser);
    return plainToClass(UserDto, user);
  }
  private async genPasswordHash(
    password: string,
  ): Promise<readonly [string, string]> {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      return [passwordHash, salt] as const;
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(userId: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: { uid: userId },
      relations: {
        roles: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const deleteUser = await this.userRepo.remove(user);
    return plainToClass(UserDto, deleteUser);
  }
}
