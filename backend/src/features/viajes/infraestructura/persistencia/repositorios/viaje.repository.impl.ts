import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IViajeRepository } from '../../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../../dominio/entidades/viaje.entity.js';
import { ViajeOrmEntity } from '../entidades/viaje.orm-entity.js';
import { ViajeOrmMapper } from '../mappers/viaje.orm-mapper.js';
import { EstadosViaje } from '../../../../../compartidos/constantes/estados-viaje.enum.js';

@Injectable()
export class ViajeRepositoryImpl implements IViajeRepository {
  constructor(
    @InjectRepository(ViajeOrmEntity)
    private readonly ormRepo: Repository<ViajeOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Viaje | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: { pasajero: true, conductor: true },
    });
    return entity ? ViajeOrmMapper.toDomain(entity) : null;
  }

  async obtenerPorPasajero(pasajeroId: string): Promise<Viaje[]> {
    const entities = await this.ormRepo.find({
      where: { pasajeroId },
      relations: { conductor: true },
      order: { fechaSolicitud: 'DESC' },
    });
    return entities.map(e => ViajeOrmMapper.toDomain(e));
  }

  async obtenerPorConductor(conductorId: string): Promise<Viaje[]> {
    const entities = await this.ormRepo.find({
      where: { conductorId },
      relations: { pasajero: true },
      order: { fechaSolicitud: 'DESC' },
    });
    return entities.map(e => ViajeOrmMapper.toDomain(e));
  }

  async guardar(viaje: Viaje): Promise<Viaje> {
    const entity = ViajeOrmMapper.toOrm(viaje);
    const saved = await this.ormRepo.save(entity);
    return ViajeOrmMapper.toDomain(saved);
  }

  async aceptarSiDisponible(
    viajeId: string,
    conductorId: string,
  ): Promise<Viaje | null> {
    const result = await this.ormRepo
      .createQueryBuilder()
      .update(ViajeOrmEntity)
      .set({
        conductorId,
        estado: EstadosViaje.ASIGNADO,
      })
      .where('id = :id', { id: viajeId })
      .andWhere('estado IN (:...estados)', {
        estados: [EstadosViaje.SOLICITADO, EstadosViaje.BUSCANDO],
      })
      .execute();

    if (!result.affected) {
      return null;
    }

    return this.obtenerPorId(viajeId);
  }

  async listar(filtros?: {
    pasajeroId?: string;
    conductorId?: string;
    limite?: number;
    estado?: string;
    desde?: Date;
    hasta?: Date;
  }): Promise<Viaje[]> {
    const qb = this.ormRepo
      .createQueryBuilder('v')
      .orderBy('v.fechaSolicitud', 'DESC')
      .take(filtros?.limite ?? 100);

    if (filtros?.pasajeroId) {
      qb.andWhere('v.pasajeroId = :pasajeroId', {
        pasajeroId: filtros.pasajeroId,
      });
    }
    if (filtros?.conductorId) {
      qb.andWhere('v.conductorId = :conductorId', {
        conductorId: filtros.conductorId,
      });
    }
    if (filtros?.estado) {
      qb.andWhere('v.estado = :estado', { estado: filtros.estado });
    }
    if (filtros?.desde) {
      qb.andWhere('v.fechaSolicitud >= :desde', { desde: filtros.desde });
    }
    if (filtros?.hasta) {
      qb.andWhere('v.fechaSolicitud <= :hasta', { hasta: filtros.hasta });
    }

    const entities = await qb.getMany();
    return entities.map((e) => ViajeOrmMapper.toDomain(e));
  }

  async obtenerViajesVencidos(minutos: number): Promise<Viaje[]> {
    const fechaLimite = new Date(Date.now() - minutos * 60000);

    const entities = await this.ormRepo
      .createQueryBuilder('viaje')
      .where('viaje.estado = :estado', { estado: EstadosViaje.SOLICITADO })
      .andWhere('viaje.fechaSolicitud <= :fechaLimite', { fechaLimite })
      .take(200)
      .getMany();

    return entities.map((e) => ViajeOrmMapper.toDomain(e));
  }

  async obtenerPendientesAsignacion(limite = 50): Promise<Viaje[]> {
    const entities = await this.ormRepo
      .createQueryBuilder('viaje')
      .where('viaje.estado IN (:...estados)', {
        estados: [EstadosViaje.SOLICITADO, EstadosViaje.BUSCANDO],
      })
      .orderBy('viaje.fechaSolicitud', 'ASC')
      .take(limite)
      .getMany();

    return entities.map((e) => ViajeOrmMapper.toDomain(e));
  }

  async contarPorEstados(estados: string[]): Promise<number> {
    if (estados.length === 0) return 0;
    return this.ormRepo
      .createQueryBuilder('v')
      .where('v.estado IN (:...estados)', { estados })
      .getCount();
  }

  async contarCompletadosDesde(desde: Date): Promise<number> {
    return this.ormRepo
      .createQueryBuilder('v')
      .where('v.estado = :estado', { estado: EstadosViaje.COMPLETADO })
      .andWhere('v.fechaSolicitud >= :desde', { desde })
      .getCount();
  }
}
