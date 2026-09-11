import { Conductor } from '../../dominio/entidades/conductor.entity.js';

export class ConductorMapper {
  static toResponse(conductor: Conductor) {
    return {
      id: conductor.id,
      nombreCompleto: conductor.nombreCompleto,
      email: conductor.email,
      telefono: conductor.telefono,
      fotoUrl: conductor.fotoUrl,
      licenciaUrl: conductor.licenciaUrl,
      seguroUrl: conductor.seguroUrl,
      estadoAprobacion: conductor.estadoAprobacion,
      estadoDisponibilidad: conductor.estadoDisponibilidad,
      vehiculo: {
        marca: conductor.vehiculoMarca,
        modelo: conductor.vehiculoModelo,
        color: conductor.vehiculoColor,
        placa: conductor.vehiculoPlaca,
      },
    };
  }

  static toResponseList(conductor: Conductor) {
    return {
      id: conductor.id,
      nombreCompleto: conductor.nombreCompleto,
      email: conductor.email,
      telefono: conductor.telefono,
      estadoAprobacion: conductor.estadoAprobacion,
      estadoDisponibilidad: conductor.estadoDisponibilidad,
    };
  }
}
