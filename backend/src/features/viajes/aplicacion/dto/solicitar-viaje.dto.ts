import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.VIAJES;
const S = MENSAJES.SWAGGER.VIAJES;

export const solicitarViajeSchema = z.object({
  pasajeroId: z.string().uuid(V.PASAJERO_ID_UUID).optional(),
  origenLat: z.number().min(-90, V.LATITUD_INVALIDA).max(90, V.LATITUD_INVALIDA),
  origenLng: z.number().min(-180, V.LONGITUD_INVALIDA).max(180, V.LONGITUD_INVALIDA),
  destinoLat: z.number().min(-90, V.LATITUD_INVALIDA).max(90, V.LATITUD_INVALIDA),
  destinoLng: z.number().min(-180, V.LONGITUD_INVALIDA).max(180, V.LONGITUD_INVALIDA),
});

export class SolicitarViajeDto {
  @ApiProperty({ example: MENSAJES.SWAGGER.COMUNES.EJEMPLO_UUID, description: S.DESC_PASAJERO_ID, required: false })
  pasajeroId!: string;

  @ApiProperty({ example: S.EJEMPLO_LATITUD_ORIGEN, description: S.DESC_LATITUD_ORIGEN })
  origenLat: number;

  @ApiProperty({ example: S.EJEMPLO_LONGITUD_ORIGEN, description: S.DESC_LONGITUD_ORIGEN })
  origenLng: number;

  @ApiProperty({ example: S.EJEMPLO_LATITUD_DESTINO, description: S.DESC_LATITUD_DESTINO })
  destinoLat: number;

  @ApiProperty({ example: S.EJEMPLO_LONGITUD_DESTINO, description: S.DESC_LONGITUD_DESTINO })
  destinoLng: number;
}
