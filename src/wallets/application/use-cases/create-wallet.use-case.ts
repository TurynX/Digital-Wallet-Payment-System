import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { WALLET_REPOSITORY } from '../../domain/wallet.repository.interface';
import type { IWalletRepository } from '../../domain/wallet.repository.interface';

@Injectable()
export class CreateWalletUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(userId: string) {
    const isWalletExists = await this.walletRepository.get(userId);
    if (isWalletExists) {
      throw new ConflictException('Wallet already exists');
    }
    const walletCreated = await this.walletRepository.create(userId);

    if (!walletCreated) {
      throw new InternalServerErrorException('Failed to create wallet');
    }

    return walletCreated;
  }
}
