import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { App } from 'supertest/types';

describe('Wallet (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const generateUniqueUser = () => ({
    name: 'John Doe',
    email: `test+${Math.random().toString(36).substring(2, 11)}@gmail.com`,
    password: 'password123',
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should get wallet balance for a registered user', async () => {
    const user = generateUniqueUser();
    await request(app.getHttpServer()).post('/auth/register').send(user);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password });

    const token = login.body.data.accessToken;

    return request(app.getHttpServer())
      .get('/wallet')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('balance');
        expect(res.body.data.balance).toBe(0);
      });
  });
});
