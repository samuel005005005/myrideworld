import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const calificarConductorSchema = z.object({
  viajeId: z.string().uuid(),
  puntuacion: z.number().int().min(1).max(5),
  comentario: z.string().optional(),
});

export class CalificarConductorDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del Viaje completado' })
  viajeId: string;

  @ApiProperty({ example: 5, description: 'Calificación de 1 a 5 estrellas' })
  puntuacion: number;

  @ApiProperty({ example: 'Excelente conductor, muy amable.', required: false })
  comentario?: string;
}
