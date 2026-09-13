import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION;
const S = MENSAJES.SWAGGER;

export const crearConductorSchema = z.object({
  nombreCompleto: z.string().min(1, V.COMUNES.NOMBRE_OBLIGATORIO).max(100),
  email: z.email({ error: V.COMUNES.EMAIL_INVALIDO }),
  telefono: z.string().min(8, V.COMUNES.TELEFONO_MIN),
  vehiculoMarca: z.string().min(1, V.CONDUCTORES.MARCA_OBLIGATORIA),
  vehiculoModelo: z.string().min(1, V.CONDUCTORES.MODELO_OBLIGATORIO),
  vehiculoColor: z.string().min(1, V.CONDUCTORES.COLOR_OBLIGATORIO),
  vehiculoPlaca: z.string().min(1, V.CONDUCTORES.PLACA_OBLIGATORIA),
  password: z.string().min(6, V.COMUNES.PASSWORD_MIN),
  aprobarAlCrear: z.boolean().optional().default(false),
});

export class CrearConductorDto {
  @ApiProperty({ example: S.CONDUCTORES.EJEMPLO_NOMBRE, description: S.CONDUCTORES.DESC_NOMBRE })
  nombreCompleto!: string;

  @ApiProperty({ example: S.COMUNES.EJEMPLO_EMAIL, description: S.COMUNES.DESC_EMAIL })
  email!: string;

  @ApiProperty({ example: S.COMUNES.EJEMPLO_TELEFONO, description: S.COMUNES.DESC_TELEFONO })
  telefono!: string;

  @ApiProperty({ example: S.CONDUCTORES.EJEMPLO_MARCA })
  vehiculoMarca!: string;

  @ApiProperty({ example: S.CONDUCTORES.EJEMPLO_MODELO })
  vehiculoModelo!: string;

  @ApiProperty({ example: S.CONDUCTORES.EJEMPLO_COLOR })
  vehiculoColor!: string;

  @ApiProperty({ example: S.CONDUCTORES.EJEMPLO_PLACA })
  vehiculoPlaca!: string;

  @ApiProperty({
    example: S.COMUNES.EJEMPLO_PASSWORD,
    description: 'Contraseña inicial para la app conductor',
  })
  password!: string;

  @ApiProperty({
    required: false,
    default: false,
    description: 'Si true, queda Aprobado al crear (alta asociación)',
  })
  aprobarAlCrear?: boolean;
}
