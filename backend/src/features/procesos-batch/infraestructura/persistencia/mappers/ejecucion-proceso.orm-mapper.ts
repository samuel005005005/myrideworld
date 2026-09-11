import { EjecucionProceso } from '../../../dominio/entidades/ejecucion-proceso.entity.js';
import { DetalleEjecucionProceso } from '../../../dominio/entidades/detalle-ejecucion.entity.js';
import { EjecucionProcesoOrmEntity } from '../entidades/ejecucion-proceso.orm-entity.js';
import { DetalleEjecucionOrmEntity } from '../entidades/detalle-ejecucion.orm-entity.js';
import { EstadosEjecucion } from '../../../../../compartidos/constantes/estados-ejecucion.enum.js';

export class EjecucionProcesoOrmMapper {
  static toDomain(entity: EjecucionProcesoOrmEntity): EjecucionProceso {
    return EjecucionProceso.reconstituir({
      id: entity.id,
      proceso: entity.proceso,
      estado: entity.estado as EstadosEjecucion,
      fechaInicio: entity.fechaInicio,
      fechaFin: entity.fechaFin,
      totalRegistros: entity.totalRegistros,
      registrosProcesados: entity.registrosProcesados,
      registrosError: entity.registrosError,
      detalle: entity.detalle,
      usuario: entity.usuario,
    });
  }

  static toOrm(dominio: EjecucionProceso): Partial<EjecucionProcesoOrmEntity> {
    return {
      id: dominio.id,
      proceso: dominio.proceso,
      estado: dominio.estado,
      fechaInicio: dominio.fechaInicio,
      fechaFin: dominio.fechaFin,
      totalRegistros: dominio.totalRegistros,
      registrosProcesados: dominio.registrosProcesados,
      registrosError: dominio.registrosError,
      detalle: dominio.detalle,
      usuario: dominio.usuario,
    };
  }

  static detalleToDomain(entity: DetalleEjecucionOrmEntity): DetalleEjecucionProceso {
    return DetalleEjecucionProceso.reconstituir({
      id: entity.id,
      ejecucionProcesoId: entity.ejecucionProcesoId,
      entidadId: entity.entidadId,
      estado: entity.estado as EstadosEjecucion,
      fechaRegistro: entity.fechaRegistro,
      jsonGenerado: entity.jsonGenerado,
      jsonRespuesta: entity.jsonRespuesta,
      traceback: entity.traceback,
      valorClave: entity.valorClave,
    });
  }

  static detalleToOrm(dominio: DetalleEjecucionProceso): Partial<DetalleEjecucionOrmEntity> {
    return {
      id: dominio.id,
      ejecucionProcesoId: dominio.ejecucionProcesoId,
      entidadId: dominio.entidadId,
      estado: dominio.estado,
      fechaRegistro: dominio.fechaRegistro,
      jsonGenerado: dominio.jsonGenerado,
      jsonRespuesta: dominio.jsonRespuesta,
      traceback: dominio.traceback,
      valorClave: dominio.valorClave,
    };
  }
}
