import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { WalletEntity } from 'src/wallets/domain/wallet.entity';
import { IWalletRepository } from '../../domain/wallet.repository.interface';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string) {
    const wallet = await this.prisma.wallet.create({
      data: {
        userId,
        balance: 0,
        currency: 'USD',
      },
    });

    return new WalletEntity(
      wallet.id,
      wallet.userId,
      wallet.balance,
      wallet.currency,
    );
  }

  async get(userId: string): Promise<WalletEntity | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      return null;
    }

    return new WalletEntity(
      wallet.id,
      wallet.userId,
      wallet.balance,
      wallet.currency,
    );
  }

  async update(
    userId: string,
    amount: number,
    operation: 'increment' | 'decrement',
  ) {
    const wallet = await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: { [operation]: amount },
      },
    });
    return new WalletEntity(
      wallet.id,
      wallet.userId,
      wallet.balance,
      wallet.currency,
    );
  }
}
