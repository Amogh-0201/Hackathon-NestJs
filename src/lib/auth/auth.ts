import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../database/prisma.service';

export function createAuth(
  prisma: PrismaService,
  configService: ConfigService,
) {
  const secret = configService.getOrThrow<string>('BETTER_AUTH_SECRET');
  if (secret.length < 32) {
    throw new Error('BETTER_AUTH_SECRET must be at least 32 characters long');
  }

  return betterAuth({
    baseURL: configService.getOrThrow<string>('BETTER_AUTH_URL'),
    secret,
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'PARTICIPANT',
          input: false,
        },
      },
    },
  });
}
