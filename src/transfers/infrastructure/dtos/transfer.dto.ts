import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;
}
