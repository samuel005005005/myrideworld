import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.COMUNES;
const S = MENSAJES.SWAGGER;

export const crearPasajeroSchema = z.object({
  nombreCompleto: z.string().min(1, V.NOMBRE_OBLIGATORIO).max(100),
  email: z.email({ error: V.EMAIL_INVALIDO }),
  telefono: z.string().min(8, V.TELEFONO_MIN),
  password: z.string().min(6, V.PASSWORD_MIN),
});

export class CrearPasajeroDto {
  @ApiProperty({ example: S.PASAJEROS.EJEMPLO_NOMBRE, description: S.PASAJEROS.DESC_NOMBRE })
  nombreCompleto: string;

  @ApiProperty({ example: S.COMUNES.EJEMPLO_EMAIL, description: S.COMUNES.DESC_EMAIL })
  email: string;

  @ApiProperty({ example: S.COMUNES.EJEMPLO_TELEFONO, description: S.COMUNES.DESC_TELEFONO })
  telefono: string;

  @ApiProperty({ example: S.COMUNES.EJEMPLO_PASSWORD, description: S.COMUNES.DESC_PASSWORD })
  password: string;
}
