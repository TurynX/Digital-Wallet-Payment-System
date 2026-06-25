import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TransferEntity } from 'src/transfers/domain/transfer.entities';
import {
  ITRANSFER_REPOSITORY,
  type ITransferRepository,
} from 'src/transfers/domain/transfer.repository.interface';
import type { CreateTransferDto } from 'src/transfers/infrastructure/dtos/transfer.dto';
import { getMyWalletUseCase } from 'src/wallets/application/use-cases/get-my-wallet.use-case';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(ITRANSFER_REPOSITORY)
    private readonly transferRepository: ITransferRepository,
    private readonly getMyWalletUseCase: getMyWalletUseCase,
  ) {}

  async execute(
    data: CreateTransferDto,
    senderId: string,
    idempotencyKey: string,
  ): Promise<TransferEntity | null> {
    const checkIdempotency =
      await this.transferRepository.findByIdempotencyKey(idempotencyKey);
    if (checkIdempotency) {
      throw new ConflictException('Transaction already exists');
    }

    console.log('Transaction', senderId);

    const senderWallet = await this.getMyWalletUseCase.execute(senderId);

    const receiverWallet = await this.getMyWalletUseCase.execute(
      data.receiverId,
    );

    if (!senderWallet || !receiverWallet) {
      throw new BadRequestException('Invalid transaction');
    }
    if (senderWallet.balance < data.amount) {
      throw new BadRequestException('Insufficient balance');
    }
    if (senderWallet.currency !== receiverWallet.currency) {
      throw new BadRequestException('Wallets must have the same currency');
    }

    if (senderWallet.userId === data.receiverId) {
      throw new BadRequestException('Cannot transfer to self');
    }

    const result = await this.transferRepository.create(
      data,
      senderId,
      idempotencyKey,
    );

    if (!result) {
      throw new BadRequestException('Transaction failed');
    }

    return result;
  }
}
