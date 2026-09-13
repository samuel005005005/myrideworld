import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const actualizarUbicacionConductorSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export class ActualizarUbicacionConductorDto {
  @ApiProperty({ example: 18.582 })
  lat!: number;

  @ApiProperty({ example: -68.3971 })
  lng!: number;
}
