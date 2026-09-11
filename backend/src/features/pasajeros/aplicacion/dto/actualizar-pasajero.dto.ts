import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.COMUNES;
const S = MENSAJES.SWAGGER;

export const actualizarPasajeroSchema = z.object({
  nombreCompleto: z.string().min(1, V.NOMBRE_OBLIGATORIO).max(100).optional(),
  telefono: z.string().min(8, V.TELEFONO_MIN).optional(),
});

export class ActualizarPasajeroDto {
  @ApiPropertyOptional({ example: S.PASAJEROS.EJEMPLO_NOMBRE, description: S.PASAJEROS.DESC_NOMBRE })
  nombreCompleto?: string;

  @ApiPropertyOptional({ example: S.COMUNES.EJEMPLO_TELEFONO, description: S.COMUNES.DESC_TELEFONO })
  telefono?: string;
}
