import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.VIAJES;
const S = MENSAJES.SWAGGER.VIAJES;

export const listarConductoresCercanosQuerySchema = z.object({
  lat: z.coerce
    .number({ error: V.LATITUD_INVALIDA })
    .min(-90, V.LATITUD_INVALIDA)
    .max(90, V.LATITUD_INVALIDA),
  lng: z.coerce
    .number({ error: V.LONGITUD_INVALIDA })
    .min(-180, V.LONGITUD_INVALIDA)
    .max(180, V.LONGITUD_INVALIDA),
  radioKm: z.coerce.number().positive().max(100).optional(),
});

export class ListarConductoresCercanosQueryDto {
  @ApiProperty({ example: S.EJEMPLO_LATITUD_ORIGEN })
  lat!: number;

  @ApiProperty({ example: S.EJEMPLO_LONGITUD_ORIGEN })
  lng!: number;

  @ApiPropertyOptional({ example: 15 })
  radioKm?: number;
}
