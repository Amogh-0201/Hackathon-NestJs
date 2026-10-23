import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ArcjetModule, shield, tokenBucket } from '@arcjet/nest';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ArcjetGuard } from './common/guards/arcjet.guard';
import { PrismaModule } from './lib/database/prisma.module';
import { PrismaService } from './lib/database/prisma.service';
import { createAuth } from './lib/auth/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'dotenv/config';

function getArcjetKey(): string {
  const key = process.env.ARCJET_KEY;
  if (!key?.trim()) {
    throw new Error('ARCJET_KEY must be set in the environment');
  }
  return key;
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule.forRootAsync({
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, configService: ConfigService) => ({
        auth: createAuth(prisma, configService),
      }),
    }),
    ArcjetModule.forRoot({
      isGlobal: true,
      key: getArcjetKey(),
      rules: [
        shield({ mode: 'LIVE' }),
        tokenBucket({
          mode: 'LIVE',
          refillRate: 100,
          interval: '1m',
          capacity: 100,
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ArcjetGuard }],
})
export class AppModule {}
