import { Pasajero } from '../../../dominio/entidades/pasajero.entity.js';
import { PasajeroOrmEntity } from '../entidades/pasajero.orm-entity.js';
import { EstadosPasajero } from '../../../../../compartidos/constantes/estados-pasajero.enum.js';

export class PasajeroOrmMapper {
  static toDomain(entity: PasajeroOrmEntity): Pasajero {
    return Pasajero.crear({
      id: entity.id,
      nombreCompleto: entity.nombreCompleto,
      email: entity.email,
      telefono: entity.telefono,
      passwordHash: entity.passwordHash,
      fechaRegistro: entity.fechaRegistro,
      estado: entity.estado as EstadosPasajero,
    });
  }

  static toOrm(pasajero: Pasajero): Partial<PasajeroOrmEntity> {
    return {
      id: pasajero.id,
      nombreCompleto: pasajero.nombreCompleto,
      email: pasajero.email,
      telefono: pasajero.telefono,
      passwordHash: pasajero.passwordHash,
      estado: pasajero.estado,
    };
  }
}
