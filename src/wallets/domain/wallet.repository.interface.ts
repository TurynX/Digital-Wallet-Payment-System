import { WalletEntity } from './wallet.entity';

export interface IWalletRepository {
  create(userId: string): Promise<WalletEntity>;
  get(userId: string): Promise<WalletEntity | null>;
  update(
    userId: string,
    amount: number,
    operation: 'increment' | 'decrement',
  ): Promise<WalletEntity>;
}

export const WALLET_REPOSITORY = 'WALLET_REPOSITOY';
