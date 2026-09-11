import { Bitacora } from '../../../dominio/entidades/bitacora.entity.js';
import { BitacoraOrmEntity } from '../entidades/bitacora.orm-entity.js';
import { TiposBitacora } from '../../../../../compartidos/constantes/tipos-bitacora.enum.js';
import { ServiciosSistema } from '../../../../../compartidos/constantes/servicios-sistema.enum.js';

export class BitacoraOrmMapper {
  static toDomain(entity: BitacoraOrmEntity): Bitacora {
    return Bitacora.registrar({
      id: entity.id,
      tipoEvento: entity.tipoEvento as TiposBitacora,
      servicioSistema: entity.servicioSistema as ServiciosSistema,
      detalle: entity.detalle,
      criterioConsulta: entity.criterioConsulta ?? undefined,
      request: entity.request ?? undefined,
      response: entity.response ?? undefined,
      usuario: entity.usuario,
      fecha: entity.fecha,
      ip: entity.ip ?? undefined,
      entidadId: entity.entidadId ?? undefined,
      accion: entity.accion,
      duracionMs: entity.duracionMs ?? undefined,
    });
  }

  static toOrm(domain: Bitacora): Partial<BitacoraOrmEntity> {
    return {
      id: domain.id,
      tipoEvento: domain.tipoEvento,
      servicioSistema: domain.servicioSistema,
      detalle: domain.detalle,
      criterioConsulta: domain.criterioConsulta,
      request: domain.request,
      response: domain.response,
      usuario: domain.usuario,
      fecha: domain.fecha,
      ip: domain.ip,
      entidadId: domain.entidadId,
      accion: domain.accion,
      duracionMs: domain.duracionMs,
    };
  }
}
