import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const registrarTokenPushSchema = z.object({
  token: z.string().min(20).max(512),
});

export class RegistrarTokenPushDto {
  @ApiProperty({ description: 'Token FCM del dispositivo' })
  token!: string;
}
