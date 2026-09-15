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
  origenDireccion: z.preprocess(
    (valor) =>
      typeof valor === 'string' && valor.trim() === '' ? undefined : valor,
    z.string().trim().min(1).max(255).optional(),
  ),
  destinoDireccion: z.preprocess(
    (valor) =>
      typeof valor === 'string' && valor.trim() === '' ? undefined : valor,
    z.string().trim().min(1).max(255).optional(),
  ),
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

  @ApiProperty({
    example: S.EJEMPLO_ORIGEN_DIRECCION,
    description: S.DESC_ORIGEN_DIRECCION,
    required: false,
  })
  origenDireccion?: string;

  @ApiProperty({
    example: S.EJEMPLO_DESTINO_DIRECCION,
    description: S.DESC_DESTINO_DIRECCION,
    required: false,
  })
  destinoDireccion?: string;
}
