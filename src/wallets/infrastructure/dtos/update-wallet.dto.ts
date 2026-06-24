import { Type } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';

export class UpdateWalletDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @IsEnum(['increment', 'decrement'])
  operation: 'increment' | 'decrement';
}
