import { Pasajero } from '../../dominio/entidades/pasajero.entity.js';
import { PasajeroResponseDto } from '../dto/pasajero-response.dto.js';

export class PasajeroMapper {
  static toResponse(pasajero: Pasajero): PasajeroResponseDto {
    return {
      id: pasajero.id,
      nombreCompleto: pasajero.nombreCompleto,
      email: pasajero.email,
      telefono: pasajero.telefono,
      estado: pasajero.estado,
      fechaRegistro: pasajero.fechaRegistro,
    };
  }
}
