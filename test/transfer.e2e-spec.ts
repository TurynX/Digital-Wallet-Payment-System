import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { App } from 'supertest/types';

describe('Transfer (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const generateUniqueUser = async (number: number) => ({
    name: 'John Doe',
    email: `${number}test+${Math.random().toString(36).substring(2, 11)}@gmail.com`,
    password: 'password123',
  });

  const getUsersData = async () => {
    const user1 = await generateUniqueUser(1);

    const user2 = await generateUniqueUser(2);

    const register1 = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user1);
    const id1 = register1.body.data.id;
    const register2 = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user2);
    const id2 = register2.body.data.id;

    const login1 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user1.email, password: user1.password });
    const token1 = login1.body.data.accessToken;
    await prisma.wallet.update({
      where: {
        userId: id1,
      },
      data: {
        balance: 10000,
      },
    });

    return { id1, id2, token1 };
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should transfer money between users', async () => {
    const { id1, id2, token1 } = await getUsersData();

    return request(app.getHttpServer())
      .post('/transfer')
      .set('Authorization', `Bearer ${token1}`)
      .set('x-idempotency-key', '1234567890')
      .send({ amount: 10000, receiverId: id2 })
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('amount', 10000);
        expect(res.body.data).toHaveProperty('receiverId', id2);
        expect(res.body.data).toHaveProperty('senderId', id1);
      });
  });

  it('should not transfer money to self', async () => {
    const { id1, token1 } = await getUsersData();

    return request(app.getHttpServer())
      .post('/transfer')
      .set('Authorization', `Bearer ${token1}`)
      .set('x-idempotency-key', '1234567891')
      .send({ amount: 10000, receiverId: id1 })
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Cannot transfer to self');
      });
  });

  it('should not transfer with insufficient balance', async () => {
    const { id1, token1, id2 } = await getUsersData();

    await prisma.wallet.update({
      where: {
        userId: id1,
      },
      data: {
        balance: 0,
      },
    });
    return request(app.getHttpServer())
      .post('/transfer')
      .set('Authorization', `Bearer ${token1}`)
      .set('x-idempotency-key', '1234567892')
      .send({ amount: 10000, receiverId: id2 })
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Insufficient balance');
      });
  });

  it('should not transfer using the same idempotency key', async () => {
    const { id1, id2, token1 } = await getUsersData();

    await request(app.getHttpServer())
      .post('/transfer')
      .set('Authorization', `Bearer ${token1}`)
      .set('x-idempotency-key', '1234567893')
      .send({ amount: 10000, receiverId: id2 });

    return request(app.getHttpServer())
      .post('/transfer')
      .set('Authorization', `Bearer ${token1}`)
      .set('x-idempotency-key', '1234567893')
      .send({ amount: 10000, receiverId: id2 })
      .expect(409)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'message',
          'Transaction already exists',
        );
      });
  });
});
