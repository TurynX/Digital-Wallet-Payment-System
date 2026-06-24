import { CreateTransferDto } from '../infrastructure/dtos/transfer.dto';
import type { TransferEntity } from './transfer.entities';

export interface ITransferRepository {
  create(
    data: CreateTransferDto,
    senderId: string,
    idempotencyKey: string,
  ): Promise<TransferEntity | null>;

  findByIdempotencyKey(idempotencyKey: string): Promise<TransferEntity | null>;

  findByUserId(userId: string): Promise<TransferEntity[] | null>;
}

export const ITRANSFER_REPOSITORY = 'ITransferRepository';
