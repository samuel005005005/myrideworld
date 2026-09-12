import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.VIAJES;

export const estimarTarifaSchema = z.object({
  origenLat: z.number().min(-90, V.LATITUD_INVALIDA).max(90, V.LATITUD_INVALIDA),
  origenLng: z.number().min(-180, V.LONGITUD_INVALIDA).max(180, V.LONGITUD_INVALIDA),
  destinoLat: z.number().min(-90, V.LATITUD_INVALIDA).max(90, V.LATITUD_INVALIDA),
  destinoLng: z.number().min(-180, V.LONGITUD_INVALIDA).max(180, V.LONGITUD_INVALIDA),
  origenNombre: z.string().min(1).optional(),
  destinoNombre: z.string().min(1).optional(),
});

export class EstimarTarifaDto {
  @ApiProperty({ example: 18.5674 })
  origenLat!: number;

  @ApiProperty({ example: -68.3634 })
  origenLng!: number;

  @ApiProperty({ example: 18.7302 })
  destinoLat!: number;

  @ApiProperty({ example: -68.5284 })
  destinoLng!: number;

  @ApiPropertyOptional({
    example: 'Aeropuerto Punta Cana',
    description: 'Nombre de zona OD; si hay tarifa activa, prioriza sobre fórmula',
  })
  origenNombre?: string;

  @ApiPropertyOptional({ example: 'Bávaro' })
  destinoNombre?: string;
}
