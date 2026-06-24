import { forwardRef, Module } from '@nestjs/common';
import { WalletController } from './infrastructure/controllers/wallet/wallet.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CreateWalletUseCase } from './application/use-cases/create-wallet.use-case';
import { getMyWalletUseCase } from './application/use-cases/get-my-wallet.use-case';
import { WALLET_REPOSITORY } from './domain/wallet.repository.interface';
import { WalletRepository } from './infrastructure/prisma/wallet.repository';
import { UpdateWalletUseCase } from './application/use-cases/update-wallet.use-case';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [WalletController],
  providers: [
    CreateWalletUseCase,
    getMyWalletUseCase,
    UpdateWalletUseCase,
    {
      provide: WALLET_REPOSITORY,
      useClass: WalletRepository,
    },
  ],

  exports: [CreateWalletUseCase, getMyWalletUseCase, UpdateWalletUseCase],
})
export class WalletsModule {}
