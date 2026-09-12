import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

const V = MENSAJES.VALIDACION.COMUNES;

export const crearAdministradorSchema = z.object({
  nombreCompleto: z.string().min(1, V.NOMBRE_OBLIGATORIO),
  email: z.email({ error: V.EMAIL_INVALIDO }),
  password: z.string().min(6, V.PASSWORD_MIN),
  rolAdmin: z.enum([
    RolesAdmin.SUPER_ADMIN,
    RolesAdmin.OPERACIONES,
    RolesAdmin.FINANZAS,
    RolesAdmin.AUDITOR,
  ]),
});

export class CrearAdministradorDto {
  @ApiProperty({ example: 'Ana Super' })
  nombreCompleto: string;

  @ApiProperty({ example: 'admin@myride.com' })
  email: string;

  @ApiProperty({ example: 'admin123' })
  password: string;

  @ApiProperty({ enum: RolesAdmin })
  rolAdmin: RolesAdmin;
}

export const actualizarAdministradorSchema = z.object({
  nombreCompleto: z.string().min(1).optional(),
  rolAdmin: z
    .enum([
      RolesAdmin.SUPER_ADMIN,
      RolesAdmin.OPERACIONES,
      RolesAdmin.FINANZAS,
      RolesAdmin.AUDITOR,
    ])
    .optional(),
  password: z.string().min(6).optional(),
  activo: z.boolean().optional(),
});

export class ActualizarAdministradorDto {
  @ApiPropertyOptional()
  nombreCompleto?: string;

  @ApiPropertyOptional({ enum: RolesAdmin })
  rolAdmin?: RolesAdmin;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  activo?: boolean;
}
