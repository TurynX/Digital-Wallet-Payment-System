import { Injectable } from '@nestjs/common';
import { ITransferRepository } from 'src/transfers/domain/transfer.repository.interface';
import { CreateTransferDto } from '../dtos/transfer.dto';
import { TransferEntity } from 'src/transfers/domain/transfer.entities';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class TransferRepository implements ITransferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<TransferEntity | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { idempotencyKey },
    });

    if (!transaction) {
      return null;
    }

    return new TransferEntity(
      transaction.id,
      transaction.senderId!,
      transaction.receiverId,
      transaction.amount,
      transaction.createdAt,
    );
  }

  async create(
    data: CreateTransferDto,
    senderId: string,
    idempotencyKey: string,
  ): Promise<TransferEntity | null> {
    try {
      const tx = await this.prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
          data: {
            idempotencyKey,
            senderId,
            receiverId: data.receiverId,
            amount: data.amount,
            status: 'COMPLETED',
            createdAt: new Date(),
          },
        });

        const updateSenderWallet = await tx.wallet.update({
          where: { userId: senderId },
          data: { balance: { decrement: data.amount } },
        });

        const updateReceiverWallet = await tx.wallet.update({
          where: { userId: data.receiverId },
          data: { balance: { increment: data.amount } },
        });

        return { transaction, updateSenderWallet, updateReceiverWallet };
      });

      return new TransferEntity(
        tx.transaction.id,
        tx.transaction.senderId!,
        tx.transaction.receiverId,
        tx.transaction.amount,
        tx.transaction.createdAt,
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByUserId(userId: string): Promise<TransferEntity[] | null> {
    const transactions = await this.prisma.transaction.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map(
      (transaction) =>
        new TransferEntity(
          transaction.id,
          transaction.senderId!,
          transaction.receiverId,
          transaction.amount,
          transaction.createdAt,
        ),
    );
  }
}
