import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from '../../dtos/auth.dto';
import { LoginUseCase } from 'src/auth/application/use-cases/login.use-case';
import { RegisterUseCase } from 'src/auth/application/use-cases/register.use-case';
import { LoginResponse, RegisterResponse } from 'src/auth/domain/auth.entities';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.loginUseCase.execute(dto);
  }
}
