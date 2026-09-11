import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const aceptarViajeSchema = z.object({
  conductorId: z.string().uuid('ID de conductor inválido'),
});

export class AceptarViajeDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'ID del Conductor' })
  conductorId: string;
}
