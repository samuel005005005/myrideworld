import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { ConductorResumenPublicoDto } from '../dto/conductor-resumen-publico.dto.js';
import { ConductorCercanoMapaDto } from '../dto/conductor-cercano-mapa.dto.js';

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

  static toCercanoMapa(conductor: Conductor): ConductorCercanoMapaDto {
    const dto = new ConductorCercanoMapaDto();
    dto.id = conductor.id;
    dto.lat = conductor.ultimaUbicacionLat ?? 0;
    dto.lng = conductor.ultimaUbicacionLng ?? 0;
    dto.vehiculoColor = conductor.vehiculoColor;
    return dto;
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
      vehiculoMarca: conductor.vehiculoMarca,
      vehiculoModelo: conductor.vehiculoModelo,
      vehiculoColor: conductor.vehiculoColor,
      ultimaUbicacionLat: conductor.ultimaUbicacionLat,
      ultimaUbicacionLng: conductor.ultimaUbicacionLng,
    };
  }
}
