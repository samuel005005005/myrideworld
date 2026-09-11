import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const cancelarViajeSchema = z.object({
  motivo: z.string().optional(),
});

export class CancelarViajeDto {
  @ApiProperty({ required: false, example: 'El conductor tarda mucho' })
  motivo?: string;
}
