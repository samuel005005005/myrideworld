import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';

export const actualizarDisponibilidadSchema = z.object({
  estadoDisponibilidad: z.enum([
    EstadosDisponibilidadConductor.CONECTADO,
    EstadosDisponibilidadConductor.DESCONECTADO,
  ]),
});

export class ActualizarDisponibilidadDto {
  @ApiProperty({
    enum: [
      EstadosDisponibilidadConductor.CONECTADO,
      EstadosDisponibilidadConductor.DESCONECTADO,
    ],
    example: EstadosDisponibilidadConductor.CONECTADO,
  })
  estadoDisponibilidad!: EstadosDisponibilidadConductor;
}
