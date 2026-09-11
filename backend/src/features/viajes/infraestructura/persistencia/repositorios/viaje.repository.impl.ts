import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IViajeRepository } from '../../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../../dominio/entidades/viaje.entity.js';
import { ViajeOrmEntity } from '../entidades/viaje.orm-entity.js';

@Injectable()
export class ViajeRepositoryImpl implements IViajeRepository {
  constructor(
    @InjectRepository(ViajeOrmEntity)
    private readonly ormRepo: Repository<ViajeOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Viaje | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async obtenerPorPasajero(pasajeroId: string): Promise<Viaje[]> {
    const entities = await this.ormRepo.find({ where: { pasajeroId } });
    return entities.map(e => this.toDomain(e));
  }

  async obtenerPorConductor(conductorId: string): Promise<Viaje[]> {
    const entities = await this.ormRepo.find({ where: { conductorId } });
    return entities.map(e => this.toDomain(e));
  }

  async guardar(viaje: Viaje): Promise<Viaje> {
    const entity = this.toOrm(viaje);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: ViajeOrmEntity): Viaje {
    return Viaje.solicitar({
      id: entity.id,
      pasajeroId: entity.pasajeroId,
      conductorId: entity.conductorId ?? undefined,
      origenLat: entity.origenLat,
      origenLng: entity.origenLng,
      destinoLat: entity.destinoLat,
      destinoLng: entity.destinoLng,
      estado: entity.estado,
      tarifaEstimada: Number(entity.tarifaEstimada),
      metodoPago: entity.metodoPago ?? undefined,
      canceladoPor: entity.canceladoPor ?? undefined,
      motivoCancelacion: entity.motivoCancelacion ?? undefined,
      fechaSolicitud: entity.fechaSolicitud,
      fechaInicio: entity.fechaInicio ?? undefined,
      fechaFin: entity.fechaFin ?? undefined,
    });
  }

  private toOrm(viaje: Viaje): Partial<ViajeOrmEntity> {
    return {
      id: viaje.id,
      pasajeroId: viaje.pasajeroId,
      conductorId: viaje.conductorId ?? undefined,
      origenLat: viaje.origenLat,
      origenLng: viaje.origenLng,
      destinoLat: viaje.destinoLat,
      destinoLng: viaje.destinoLng,
      estado: viaje.estado,
      tarifaEstimada: viaje.tarifaEstimada,
      metodoPago: viaje.metodoPago ?? undefined,
      canceladoPor: viaje.canceladoPor ?? undefined,
      motivoCancelacion: viaje.motivoCancelacion ?? undefined,
      fechaSolicitud: viaje.fechaSolicitud,
      fechaInicio: viaje.fechaInicio ?? undefined,
      fechaFin: viaje.fechaFin ?? undefined,
    };
  }
}
