import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const solicitarViajeSchema = z.object({
  pasajeroId: z.string().uuid(),
  origenLat: z.number().min(-90).max(90),
  origenLng: z.number().min(-180).max(180),
  destinoLat: z.number().min(-90).max(90),
  destinoLng: z.number().min(-180).max(180),
});

export class SolicitarViajeDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  pasajeroId: string;

  @ApiProperty({ example: -34.6037, description: 'Latitud de origen' })
  origenLat: number;

  @ApiProperty({ example: -58.3816, description: 'Longitud de origen' })
  origenLng: number;

  @ApiProperty({ example: -34.5837, description: 'Latitud de destino' })
  destinoLat: number;

  @ApiProperty({ example: -58.4016, description: 'Longitud de destino' })
  destinoLng: number;
}
