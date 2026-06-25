import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import { getMyWalletUseCase } from 'src/wallets/application/use-cases/get-my-wallet.use-case';

@UseGuards(AuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly getMyWalletUseCase: getMyWalletUseCase) {}

  @Get()
  @HttpCode(200)
  async getMyWallet(@Req() req: any) {
    const userId = req['user'].sub;
    const wallet = await this.getMyWalletUseCase.execute(userId);
    return { data: wallet };
  }
}
