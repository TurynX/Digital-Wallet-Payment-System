import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import { CreateTransferDto } from '../dtos/transfer.dto';
import { CreateTransactionUseCase } from 'src/transfers/application/use-cases/create-transaction.use-case';
import { GetTransactionsHistoryUseCase } from 'src/transfers/application/use-cases/get-transactions-history.use-case';

@UseGuards(AuthGuard)
@Controller('transfer')
export class TransfersController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsHistoryUseCase: GetTransactionsHistoryUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async transfer(@Req() req: Request, @Body() dto: CreateTransferDto) {
    const userId = req['user'].sub;
    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    const result = await this.createTransactionUseCase.execute(
      dto,
      userId,
      idempotencyKey,
    );
    return { status: 'Transaction Created Successfully', data: result };
  }

  @Get()
  @HttpCode(200)
  async getTransactionsHistory(@Req() req: Request) {
    const userId = req['user'].sub;
    const result = await this.getTransactionsHistoryUseCase.execute(userId);
    return { status: 'Transactions History', data: result };
  }
}
