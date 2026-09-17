import { Pasajero } from '../../dominio/entidades/pasajero.entity.js';
import { PasajeroResponseDto } from '../dto/pasajero-response.dto.js';
import { PasajeroResumenPublicoDto } from '../dto/pasajero-resumen-publico.dto.js';

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

  static toResumenPublico(pasajero: Pasajero): PasajeroResumenPublicoDto {
    const resumen = new PasajeroResumenPublicoDto();
    resumen.id = pasajero.id;
    resumen.nombreCompleto = pasajero.nombreCompleto;
    resumen.telefono = pasajero.telefono;
    return resumen;
  }
}
