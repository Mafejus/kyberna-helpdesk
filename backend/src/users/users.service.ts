import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check email uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Destructure password out to avoid passing it to Prisma
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...rest,
        passwordHash: hashedPassword,
      },
    });
  }

  findAll(role?: Role) {
    const where = role ? { role } : {};
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Role updates are FORBIDDEN by business rules
    if (updateUserDto.role) {
      throw new ForbiddenException('Changing role is not allowed');
    }
    // Password updates should use the specific endpoint
    if (updateUserDto.password) {
      throw new ForbiddenException(
        'Password update not allowed here. Use /users/:id/password endpoint.',
      );
    }

    const data: any = { ...updateUserDto };
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async resetPassword(id: string, password: string) {
    if (!password) throw new BadRequestException('Password required');
    const passwordHash = await bcrypt.hash(password, 12);
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash, passwordUpdatedAt: new Date() },
    });
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) throw new ForbiddenException('Invalid current password');

    const passwordHash = await bcrypt.hash(newPass, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, passwordUpdatedAt: new Date() },
    });

    return { success: true };
  }

  remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
