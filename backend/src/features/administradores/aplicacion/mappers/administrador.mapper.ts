import { Administrador } from '../../dominio/entidades/administrador.entity.js';
import { AdministradorResponseDto } from '../dto/administrador-response.dto.js';

export class AdministradorMapper {
  static toResponse(admin: Administrador): AdministradorResponseDto {
    return {
      id: admin.id,
      nombreCompleto: admin.nombreCompleto,
      email: admin.email,
      rolAdmin: admin.rolAdmin,
      activo: admin.activo,
      fechaRegistro: admin.fechaRegistro,
    };
  }
}
