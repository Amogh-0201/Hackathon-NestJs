import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ArcjetModule, shield, tokenBucket } from '@arcjet/nest';
import { ArcjetGuard } from './common/guards/arcjet.guard';
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
    ArcjetModule.forRoot({
      isGlobal: true,
      key: getArcjetKey(),
      rules: [
        shield({ mode: 'LIVE' }),
        tokenBucket({
          mode: 'LIVE',
          refillRate: 10,
          interval: '1m',
          capacity: 10,
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ArcjetGuard }],
})
export class AppModule {}
