import { RegisterDto } from 'src/auth/infrastructure/dtos/auth.dto';
import * as argon2 from 'argon2';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import type { IAuthRepository } from 'src/auth/domain/auth.repo.interface';
import { RegisterResponse } from 'src/auth/domain/auth.entities';
import { CreateWalletUseCase } from 'src/wallets/application/use-cases/create-wallet.use-case';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('AUTH_REPOSITORY') private readonly authRepository: IAuthRepository,
    private readonly createWalletUseCase: CreateWalletUseCase,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResponse> {
    const { email, password } = dto;

    const isEmailRegistered = await this.authRepository.findByEmail(email);

    if (isEmailRegistered) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = await argon2.hash(password);

    const registeredUser = await this.authRepository.register({
      email,
      password: hashedPassword,
    });

    if (!registeredUser) {
      throw new InternalServerErrorException('Failed to register');
    }

    await this.createWalletUseCase.execute(registeredUser.id);

    return new RegisterResponse(registeredUser.id, registeredUser.email);
  }
}
