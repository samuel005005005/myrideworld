import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const E = MENSAJES.EXCEPCIONES.TARIFAS;

export const crearTarifaSchema = z.object({
  origen: z.string().min(1, E.ORIGEN_DESTINO_OBLIGATORIOS),
  destino: z.string().min(1, E.ORIGEN_DESTINO_OBLIGATORIOS),
  precio: z.number().positive(E.PRECIO_MAYOR_CERO),
});

export class CrearTarifaDto {
  @ApiProperty({ example: 'Aeropuerto Punta Cana' })
  origen!: string;

  @ApiProperty({ example: 'Bávaro' })
  destino!: string;

  @ApiProperty({ example: 45 })
  precio!: number;
}

export const actualizarTarifaSchema = z.object({
  origen: z.string().min(1).optional(),
  destino: z.string().min(1).optional(),
  precio: z.number().positive().optional(),
  estado: z.enum([EstadosTarifa.ACTIVO, EstadosTarifa.INACTIVO]).optional(),
});

export class ActualizarTarifaDto {
  @ApiPropertyOptional()
  origen?: string;

  @ApiPropertyOptional()
  destino?: string;

  @ApiPropertyOptional()
  precio?: number;

  @ApiPropertyOptional({ enum: EstadosTarifa })
  estado?: EstadosTarifa;
}
