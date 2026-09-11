import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginUseCase } from '../../aplicacion/casos-uso/login.use-case.js';
import type { LoginDto } from '../../aplicacion/dto/login.dto.js';

@ApiTags('Autenticación')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión (Generar Token JWT)' })
  async login(@Body() dto: LoginDto) {
    // Nota: El ZodValidationPipe global validará el DTO automáticamente
    return await this.loginUseCase.ejecutar(dto);
  }
}
