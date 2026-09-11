import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.COMUNES;
const VC = MENSAJES.VALIDACION.CONDUCTORES;
const S = MENSAJES.SWAGGER;

export const actualizarConductorSchema = z.object({
  nombreCompleto: z.string().min(1, V.NOMBRE_OBLIGATORIO).max(100).optional(),
  telefono: z.string().min(8, V.TELEFONO_MIN).optional(),
  vehiculoMarca: z.string().min(1, VC.MARCA_OBLIGATORIA).optional(),
  vehiculoModelo: z.string().min(1, VC.MODELO_OBLIGATORIO).optional(),
  vehiculoColor: z.string().min(1, VC.COLOR_OBLIGATORIO).optional(),
  vehiculoPlaca: z.string().min(1, VC.PLACA_OBLIGATORIA).optional(),
});

export class ActualizarConductorDto {
  @ApiPropertyOptional({ example: S.CONDUCTORES.EJEMPLO_NOMBRE, description: S.CONDUCTORES.DESC_NOMBRE })
  nombreCompleto?: string;

  @ApiPropertyOptional({ example: S.COMUNES.EJEMPLO_TELEFONO, description: S.COMUNES.DESC_TELEFONO })
  telefono?: string;

  @ApiPropertyOptional({ example: S.CONDUCTORES.EJEMPLO_MARCA })
  vehiculoMarca?: string;

  @ApiPropertyOptional({ example: S.CONDUCTORES.EJEMPLO_MODELO })
  vehiculoModelo?: string;

  @ApiPropertyOptional({ example: S.CONDUCTORES.EJEMPLO_COLOR })
  vehiculoColor?: string;

  @ApiPropertyOptional({ example: S.CONDUCTORES.EJEMPLO_PLACA })
  vehiculoPlaca?: string;
}
