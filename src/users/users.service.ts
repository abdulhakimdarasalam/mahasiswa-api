import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { KnexService } from '../database/knex.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly knexService: KnexService) {}

  private isEmailUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === '23505'
    );
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const { email, name, password } = createUserDto;
      const normalizedEmail = this.normalizeEmail(email);
      const hashedPassword = await bcrypt.hash(password, 10);
      const [user] = await this.knexService
        .connection('users')
        .insert({
          email: normalizedEmail,
          name,
          password: hashedPassword,
          is_active: true,
          register_date: new Date(),
        })
        .returning('*');
      return this.mapToResponseDto(user);
    } catch (error) {
      if (this.isEmailUniqueViolation(error)) {
        throw new ConflictException('Email already used');
      }
      throw error;
    }
  }
  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_active: user.is_active,
      register_date: user.register_date,
    };
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.knexService
      .connection('users')
      .select('*')
      .where({ is_active: true });
    return users.map(this.mapToResponseDto);
  }

  async findById(id: number): Promise<UserResponseDto> {
    const [user] = await this.knexService
      .connection('users')
      .where({ id })
      .select('*')
      .where({ is_active: true });
    return this.mapToResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const [user] = await this.knexService
      .connection('users')
      .where({ email })
      .select('*')
      .where({ is_active: true });
    return this.mapToResponseDto(user);
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserResponseDto> {
    try {
      const { email, name, password, is_active } = updateUserDto;
      const hashedPassword = await bcrypt.hash(password as string, 10);
      const [user] = await this.knexService
        .connection('users')
        .where({ id })
        .update({
          email: email,
          name: name,
          password: hashedPassword,
          is_active: is_active,
        })
        .returning('*');
      return this.mapToResponseDto(user);
    } catch (error) {
      if (this.isEmailUniqueViolation(error)) {
        throw new ConflictException('Email already used');
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await this.knexService
      .connection('users')
      .where({ id })
      .update({ is_active: false });
  }
}
