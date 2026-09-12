import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { LoginUseCase } from '../../aplicacion/casos-uso/login.use-case.js';
import { loginSchema, type LoginDto } from '../../aplicacion/dto/login.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';

@ApiTags('Autenticación')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión (Generar Token JWT)' })
  async login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto,
  ) {
    return await this.loginUseCase.ejecutar(dto);
  }
}
