import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';
import { KnexService } from '../database/knex.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly knexService: KnexService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private getRequiredEnv(name: string): string {
    const value = this.configService.get<string>(name);
    if (!value) {
      throw new Error(`Missing ${name} in environment variables`);
    }
    return value;
  }

  private async signTokenPair(payload: JwtPayload) {
    const accessSecret = this.getRequiredEnv('JWT_SECRET');
    const accessExpiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') ??
      '15m') as StringValue;
    const refreshSecret = this.getRequiredEnv('JWT_REFRESH_SECRET');
    const refreshExpiresIn = (this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    ) ?? '7d') as StringValue;

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      access_token,
      refresh_token,
      token_type: 'Bearer',
    };
  }

  async login(loginDto: LoginDto) {
    const email = this.normalizeEmail(loginDto.email);

    const user = await this.knexService
      .connection('users')
      .select('id', 'email', 'name', 'password', 'is_active')
      .where({ email, is_active: true })
      .first();

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return this.signTokenPair(payload);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      const refreshSecret = this.getRequiredEnv('JWT_REFRESH_SECRET');

      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refresh_token,
        {
          secret: refreshSecret,
        },
      );

      const user = await this.knexService
        .connection('users')
        .select('id', 'email', 'name', 'is_active')
        .where({ id: payload.sub, is_active: true })
        .first();

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.signTokenPair({
        sub: user.id,
        email: user.email,
        name: user.name,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
