import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

export const crearZonaTarifaSchema = z.object({
  nombre: z.string().min(1, MENSAJES.EXCEPCIONES.TARIFAS.ORIGEN_DESTINO_OBLIGATORIOS),
});

export class CrearZonaTarifaDto {
  @ApiProperty({ example: 'Aeropuerto Internacional de Punta Cana (PUJ)' })
  nombre!: string;
}
