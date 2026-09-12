import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

export const actualizarConfiguracionSchema = z.object({
  valor: z.string().min(1, MENSAJES.EXCEPCIONES.CONFIGURACION.VALOR_OBLIGATORIO),
});

export class ActualizarConfiguracionDto {
  @ApiProperty({ example: '30.0', description: 'Nuevo valor de la configuración' })
  valor!: string;
}
