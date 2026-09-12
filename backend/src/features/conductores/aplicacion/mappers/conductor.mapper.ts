import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { ConductorResumenPublicoDto } from '../dto/conductor-resumen-publico.dto.js';

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

  static toResumenPublico(conductor: Conductor): ConductorResumenPublicoDto {
    const resumen = new ConductorResumenPublicoDto();
    resumen.id = conductor.id;
    resumen.nombreCompleto = conductor.nombreCompleto;
    resumen.telefono = conductor.telefono;
    resumen.fotoUrl = conductor.fotoUrl;
    resumen.vehiculoMarca = conductor.vehiculoMarca;
    resumen.vehiculoModelo = conductor.vehiculoModelo;
    resumen.vehiculoColor = conductor.vehiculoColor;
    resumen.vehiculoPlaca = conductor.vehiculoPlaca;
    return resumen;
  }

  static toResponseList(conductor: Conductor) {
    return {
      id: conductor.id,
      nombreCompleto: conductor.nombreCompleto,
      email: conductor.email,
      telefono: conductor.telefono,
      estadoAprobacion: conductor.estadoAprobacion,
      estadoDisponibilidad: conductor.estadoDisponibilidad,
      fotoUrl: conductor.fotoUrl,
      licenciaUrl: conductor.licenciaUrl,
      seguroUrl: conductor.seguroUrl,
      vehiculoPlaca: conductor.vehiculoPlaca,
    };
  }
}
