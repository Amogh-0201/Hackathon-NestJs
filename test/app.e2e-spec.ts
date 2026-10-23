import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/lib/database/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api/auth/ok (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/auth/ok')
      .expect(200)
      .expect({ ok: true });
  });

  it('does not accept an ADMIN role during sign-up', async () => {
    const email = `auth-role-test-${randomUUID()}@example.com`;

    try {
      await request(app.getHttpServer())
        .post('/api/auth/sign-up/email')
        .send({
          name: 'Role Test',
          email,
          password: 'TestPassword123!',
          role: 'ADMIN',
        })
        .expect(200);

      const user = await prisma.user.findUnique({ where: { email } });
      expect(user?.role).toBe('PARTICIPANT');
    } finally {
      await prisma.user.deleteMany({ where: { email } });
    }
  });

  afterEach(async () => {
    await app.close();
  });
});
