import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.isActive &&
      (await bcrypt.compare(pass, user.passwordHash))
    ) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    // 1. Domain Validation
    const allowedDomain = this.configService.get<string>(
      'ALLOWED_EMAIL_DOMAIN',
    );
    if (allowedDomain && !loginDto.email.endsWith(`@${allowedDomain}`)) {
      throw new BadRequestException(`Email domain must be @${allowedDomain}`);
    }

    // 2. Validate Credentials
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials or inactive account',
      );
    }

    // 3. Generate Token
    const payload = { sub: user.id, email: user.email, role: user.role, fullName: user.fullName };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
