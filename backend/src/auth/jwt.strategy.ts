import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is disabled');
    }

    // Check if password was changed after token issuance
    if (payload.iat && user.passwordUpdatedAt) {
      const tokenTime = payload.iat * 1000;
      const pwdTime = new Date(user.passwordUpdatedAt).getTime();

      // If token issued BEFORE password update -> invalid
      // Adding 1 second buffer to avoid race conditions
      if (tokenTime < pwdTime - 1000) {
        throw new UnauthorizedException('Password changed, please login again');
      }
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
  }
}
