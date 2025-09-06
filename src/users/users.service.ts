import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async createUser(email: string, password: string, confirmPassword: string, username?: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Email already used');
    const hashed = await bcrypt.hash(password, 10);

    if (password !== confirmPassword) {
     throw new BadRequestException("Please Provide Valid Credentials.")
    }
     return this.prisma.user.create({
        data: { email, password: hashed, username },
      });

  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async setEmailVerified(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { isEmailVerified: true } });
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  }
}
