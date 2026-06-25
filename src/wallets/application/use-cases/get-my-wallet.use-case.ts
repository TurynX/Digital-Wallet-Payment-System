import { Injectable, Inject } from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/wallet.repository.interface';
import type { IWalletRepository } from '../../domain/wallet.repository.interface';

@Injectable()
export class getMyWalletUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepo: IWalletRepository,
  ) {}

  async execute(userId: string) {
    const wallet = await this.walletRepo.get(userId);
    if (!wallet) {
      return await this.walletRepo.create(userId);
    }
    return wallet;
  }
}
