import { Inject, Injectable } from '@nestjs/common';
import { TransferEntity } from 'src/transfers/domain/transfer.entities';
import {
  ITRANSFER_REPOSITORY,
  type ITransferRepository,
} from 'src/transfers/domain/transfer.repository.interface';

@Injectable()
export class GetTransactionsHistoryUseCase {
  constructor(
    @Inject(ITRANSFER_REPOSITORY)
    private readonly transferRepository: ITransferRepository,
  ) {}

  async execute(userId: string): Promise<TransferEntity[] | null> {
    return this.transferRepository.findByUserId(userId);
  }
}
