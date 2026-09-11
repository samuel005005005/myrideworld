import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.COMUNES;
const S = MENSAJES.SWAGGER.COMUNES;

export const loginSchema = z.object({
  email: z.email({ error: V.EMAIL_INVALIDO }),
  password: z.string().min(1, V.PASSWORD_MIN),
  rol: z.enum([Roles.PASAJERO, Roles.CONDUCTOR, Roles.ADMIN]),
});

export class LoginDto {
  @ApiProperty({ example: S.EJEMPLO_EMAIL, description: S.DESC_EMAIL })
  email: string;

  @ApiProperty({ example: S.EJEMPLO_PASSWORD, description: S.DESC_PASSWORD })
  password: string;

  @ApiProperty({ enum: Roles, example: Roles.PASAJERO })
  rol: Roles;
}
