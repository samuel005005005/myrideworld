import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearPasajeroUseCase } from '../../aplicacion/casos-uso/crear-pasajero.use-case.js';
import { crearPasajeroSchema } from '../../aplicacion/dto/crear-pasajero.dto.js';
import type { CrearPasajeroDto } from '../../aplicacion/dto/crear-pasajero.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';

@Controller('api/pasajeros')
export class PasajerosController {
  constructor(private readonly crearPasajero: CrearPasajeroUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body(new ZodValidationPipe(crearPasajeroSchema)) dto: CrearPasajeroDto) {
    const pasajero = await this.crearPasajero.ejecutar(dto);
    
    // Mapeo básico de respuesta (en el futuro se debe usar un UsuarioResponseDto)
    return {
      id: pasajero.id,
      nombreCompleto: pasajero.nombreCompleto,
      email: pasajero.email,
      telefono: pasajero.telefono,
      estado: pasajero.estado,
      fechaRegistro: pasajero.fechaRegistro,
    };
  }
}
