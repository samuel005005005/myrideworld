import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const S = MENSAJES.SWAGGER.VIAJES;

export const cancelarViajeSchema = z.object({
  motivo: z.string().optional(),
});

export class CancelarViajeDto {
  @ApiProperty({ required: false, example: S.EJEMPLO_MOTIVO })
  motivo?: string;
}
