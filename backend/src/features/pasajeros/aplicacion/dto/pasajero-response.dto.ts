import { ApiProperty } from '@nestjs/swagger';

export class PasajeroResponseDto {
  @ApiProperty({ description: 'ID único del pasajero (UUID)' })
  id: string;

  @ApiProperty({ description: 'Nombre completo del pasajero' })
  nombreCompleto: string;

  @ApiProperty({ description: 'Correo electrónico' })
  email: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  telefono: string;

  @ApiProperty({ description: 'Estado actual del pasajero' })
  estado: string;

  @ApiProperty({ description: 'Fecha de registro' })
  fechaRegistro: Date;
}
