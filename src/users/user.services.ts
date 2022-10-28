import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { ProfileEntity } from 'src/entities/profile.entity';
import { RoleEntity } from 'src/entities/role.entity';
import { UserEntity } from 'src/entities/user.entity';
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
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles')
      .getMany();
    return users.map((user) => plainToClass(UserDto, user));
  }

  async findById(uid: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { uid } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserEntity | null> {
    const user = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
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
    const newProfile = new ProfileEntity(
      newUser.uid,
      userData.firstName,
      userData.lastName,
    );
    newUser.profile = newProfile;
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
}
