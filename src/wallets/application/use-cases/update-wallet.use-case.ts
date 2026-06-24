import { Inject, Injectable } from '@nestjs/common';
import type { IWalletRepository } from '../../domain/wallet.repository.interface';
import { WALLET_REPOSITORY } from '../../domain/wallet.repository.interface';

@Injectable()
export class UpdateWalletUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(
    userId: string,
    amount: number,
    operation: 'increment' | 'decrement',
  ) {
    return this.walletRepository.update(userId, amount, operation);
  }
}
