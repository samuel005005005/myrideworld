import { Idempotencia, EstadoIdempotencia } from '../../../dominio/entidades/idempotencia.entity.js';
import { IdempotenciaOrmEntity } from '../entidades/idempotencia.orm-entity.js';

export class IdempotenciaOrmMapper {
  static toDomain(entity: IdempotenciaOrmEntity): Idempotencia {
    return Idempotencia.reconstruir({
      id: entity.id,
      llave: entity.llave,
      url: entity.url,
      cuerpoPeticionHash: entity.cuerpoPeticionHash,
      respuesta: entity.respuesta,
      codigoEstado: entity.codigoEstado,
      estado: entity.estado as EstadoIdempotencia,
      fechaCreacion: entity.fechaCreacion,
      fechaActualizacion: entity.fechaActualizacion,
    });
  }

  static toOrm(dominio: Idempotencia): IdempotenciaOrmEntity {
    const entity = new IdempotenciaOrmEntity();
    entity.id = dominio.id;
    entity.llave = dominio.llave;
    entity.url = dominio.url;
    entity.cuerpoPeticionHash = dominio.cuerpoPeticionHash;
    entity.respuesta = dominio.respuesta;
    entity.codigoEstado = dominio.codigoEstado;
    entity.estado = dominio.estado;
    entity.fechaCreacion = dominio.fechaCreacion;
    entity.fechaActualizacion = dominio.fechaActualizacion;
    return entity;
  }
}
