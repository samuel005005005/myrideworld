import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const loginSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  rol: z.enum(['PASAJERO', 'CONDUCTOR']),
});

export class LoginDto {
  @ApiProperty({ example: 'pasajero@example.com', description: 'Correo del usuario' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Contraseña secreta' })
  password: string;

  @ApiProperty({ enum: ['PASAJERO', 'CONDUCTOR'], example: 'PASAJERO' })
  rol: 'PASAJERO' | 'CONDUCTOR';
}
