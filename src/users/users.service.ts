import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { KnexService } from '../database/knex.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly knexService: KnexService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, name, password, is_active, register_date } = createUserDto;

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const [user] = await this.knexService
      .connection('users')
      .insert({
        email,
        name,
        password: hashedPassword,
        is_active: is_active ?? true,
        register_date: register_date ?? new Date(),
      })
      .returning('*');

    // Remove password from response
    return this.mapToResponseDto(user);
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
  }

  async delete(id: number): Promise<void> {
    await this.knexService
      .connection('users')
      .where({ id })
      .update({ is_active: false });
  }
}
