import { Module } from '@nestjs/common';
import { TransfersController } from './infrastructure/controllers/transfers.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { ITRANSFER_REPOSITORY } from './domain/transfer.repository.interface';
import { TransferRepository } from './infrastructure/prisma/transfer.repository';
import { WalletsModule } from 'src/wallets/wallets.module';
import { GetTransactionsHistoryUseCase } from './application/use-cases/get-transactions-history.use-case';

@Module({
  imports: [AuthModule, WalletsModule],
  controllers: [TransfersController],
  providers: [
    CreateTransactionUseCase,
    GetTransactionsHistoryUseCase,
    {
      provide: ITRANSFER_REPOSITORY,
      useClass: TransferRepository,
    },
  ],
})
export class TransfersModule {}
