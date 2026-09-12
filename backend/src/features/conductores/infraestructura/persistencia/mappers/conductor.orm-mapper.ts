import { Conductor } from '../../../dominio/entidades/conductor.entity.js';
import { ConductorOrmEntity } from '../entidades/conductor.orm-entity.js';
import { EstadosConductor } from '../../../../../compartidos/constantes/estados-conductor.enum.js';
import { EstadosDisponibilidadConductor } from '../../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';

export class ConductorOrmMapper {
  static toDomain(entity: ConductorOrmEntity): Conductor {
    return Conductor.crear({
      id: entity.id,
      nombreCompleto: entity.nombreCompleto,
      email: entity.email,
      telefono: entity.telefono,
      passwordHash: entity.passwordHash,
      fotoUrl: entity.fotoUrl ?? undefined,
      licenciaUrl: entity.licenciaUrl ?? undefined,
      seguroUrl: entity.seguroUrl ?? undefined,
      vehiculoMarca: entity.vehiculoMarca,
      vehiculoModelo: entity.vehiculoModelo,
      vehiculoColor: entity.vehiculoColor,
      vehiculoPlaca: entity.vehiculoPlaca,
      estadoAprobacion: entity.estadoAprobacion as EstadosConductor,
      estadoDisponibilidad: entity.estadoDisponibilidad as EstadosDisponibilidadConductor,
      ultimaUbicacionLat: entity.ultimaUbicacionLat ? Number(entity.ultimaUbicacionLat) : undefined,
      ultimaUbicacionLng: entity.ultimaUbicacionLng ?? undefined,
    });
  }

  static toOrm(conductor: Conductor): Partial<ConductorOrmEntity> {
    return {
      id: conductor.id,
      nombreCompleto: conductor.nombreCompleto,
      email: conductor.email,
      telefono: conductor.telefono,
      passwordHash: conductor.passwordHash,
      fotoUrl: conductor.fotoUrl ?? undefined,
      licenciaUrl: conductor.licenciaUrl ?? undefined,
      seguroUrl: conductor.seguroUrl ?? undefined,
      vehiculoMarca: conductor.vehiculoMarca,
      vehiculoModelo: conductor.vehiculoModelo,
      vehiculoColor: conductor.vehiculoColor,
      vehiculoPlaca: conductor.vehiculoPlaca,
      estadoAprobacion: conductor.estadoAprobacion,
      estadoDisponibilidad: conductor.estadoDisponibilidad,
      ultimaUbicacionLat: conductor.ultimaUbicacionLat ?? undefined,
      ultimaUbicacionLng: conductor.ultimaUbicacionLng ?? undefined,
    };
  }
}
