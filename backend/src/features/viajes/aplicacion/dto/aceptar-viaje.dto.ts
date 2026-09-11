import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.VIAJES;
const S = MENSAJES.SWAGGER.VIAJES;

export const aceptarViajeSchema = z.object({
  conductorId: z.string().uuid(V.CONDUCTOR_ID_UUID),
});

export class AceptarViajeDto {
  @ApiProperty({ example: MENSAJES.SWAGGER.COMUNES.EJEMPLO_UUID_2, description: S.DESC_CONDUCTOR_ID })
  conductorId: string;
}
