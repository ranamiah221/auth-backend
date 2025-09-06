import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { addMinutes } from 'date-fns';
import { VerificationType } from '@prisma/client';

@Injectable()
export class TokenService {
    constructor(private prisma: PrismaService) { }

    async createToken(userId: string, rawToken: string, type: VerificationType, expiresInMinutes: number) {
        const hashed = await bcrypt.hash(rawToken, 10);
        const expiresAt = addMinutes(new Date(), expiresInMinutes);
        return this.prisma.verificationToken.create({
            data: { userId, token: hashed, type, expiresAt },
        });
    }

    async consumeValidTokenForUser(userId: string, rawToken: string, type: VerificationType) {
        const tokens = await this.prisma.verificationToken.findMany({
            where: { userId, type, used: false, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        });
        for (const t of tokens) {
            const ok = await bcrypt.compare(rawToken, t.token);
            if (ok) {
                await this.prisma.verificationToken.update({ where: { id: t.id }, data: { used: true } });
                return t;
            }
        }
        throw new BadRequestException('Invalid or expired code');
    }
}
