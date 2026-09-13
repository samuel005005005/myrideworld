import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';

export const actualizarDisponibilidadSchema = z
  .object({
    estadoDisponibilidad: z.enum([
      EstadosDisponibilidadConductor.CONECTADO,
      EstadosDisponibilidadConductor.DESCONECTADO,
    ]),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  })
  .superRefine((val, ctx) => {
    if (
      val.estadoDisponibilidad === EstadosDisponibilidadConductor.CONECTADO &&
      (val.lat === undefined || val.lng === undefined)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Lat/lng obligatorios al ponerse en línea',
        path: ['lat'],
      });
    }
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

  @ApiPropertyOptional({ example: 18.582 })
  lat?: number;

  @ApiPropertyOptional({ example: -68.3971 })
  lng?: number;
}
