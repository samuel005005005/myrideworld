import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CrearConductorUseCase } from '../../aplicacion/casos-uso/crear-conductor.use-case.js';
import { crearConductorSchema } from '../../aplicacion/dto/crear-conductor.dto.js';
import type { CrearConductorDto } from '../../aplicacion/dto/crear-conductor.dto.js';
import { ZodValidationPipe } from '../../../../compartidos/utilidades/pipes/zod-validation.pipe.js';

@Controller('api/conductores')
export class ConductoresController {
  constructor(private readonly crearConductor: CrearConductorUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body(new ZodValidationPipe(crearConductorSchema)) dto: CrearConductorDto) {
    const conductor = await this.crearConductor.ejecutar(dto);
    
    return {
      id: conductor.id,
      nombreCompleto: conductor.nombreCompleto,
      email: conductor.email,
      telefono: conductor.telefono,
      estadoAprobacion: conductor.estadoAprobacion,
      estadoDisponibilidad: conductor.estadoDisponibilidad,
      vehiculo: {
        marca: conductor.vehiculoMarca,
        modelo: conductor.vehiculoModelo,
        color: conductor.vehiculoColor,
        placa: conductor.vehiculoPlaca,
      }
    };
  }
}
