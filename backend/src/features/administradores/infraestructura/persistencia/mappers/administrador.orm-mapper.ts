import { Administrador } from '../../../dominio/entidades/administrador.entity.js';
import { AdministradorOrmEntity } from '../entidades/administrador.orm-entity.js';
import { RolesAdmin } from '../../../../../compartidos/constantes/roles-admin.enum.js';

export class AdministradorOrmMapper {
  static toDomain(entity: AdministradorOrmEntity): Administrador {
    return Administrador.crear({
      id: entity.id,
      nombreCompleto: entity.nombreCompleto,
      email: entity.email,
      passwordHash: entity.passwordHash,
      rolAdmin: entity.rolAdmin as RolesAdmin,
      activo: entity.activo,
      fechaRegistro: entity.fechaRegistro,
    });
  }

  static toOrm(administrador: Administrador): Partial<AdministradorOrmEntity> {
    return {
      id: administrador.id,
      nombreCompleto: administrador.nombreCompleto,
      email: administrador.email,
      passwordHash: administrador.passwordHash,
      rolAdmin: administrador.rolAdmin,
      activo: administrador.activo,
      fechaRegistro: administrador.fechaRegistro,
    };
  }
}
