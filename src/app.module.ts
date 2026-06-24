import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [AuthModule, PrismaModule, WalletsModule, TransfersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
