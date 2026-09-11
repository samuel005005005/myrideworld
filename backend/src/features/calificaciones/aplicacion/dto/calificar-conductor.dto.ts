import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.CALIFICACIONES;
const S = MENSAJES.SWAGGER.CALIFICACIONES;

export const calificarConductorSchema = z.object({
  viajeId: z.string().uuid(V.VIAJE_ID_UUID),
  puntuacion: z.number().int().min(1, V.PUNTUACION_RANGO).max(5, V.PUNTUACION_RANGO),
  comentario: z.string().optional(),
});

export class CalificarConductorDto {
  @ApiProperty({ example: MENSAJES.SWAGGER.COMUNES.EJEMPLO_UUID, description: S.DESC_VIAJE_ID })
  viajeId: string;

  @ApiProperty({ example: 5, description: S.DESC_PUNTUACION })
  puntuacion: number;

  @ApiProperty({ example: S.EJEMPLO_COMENTARIO, required: false })
  comentario?: string;
}
