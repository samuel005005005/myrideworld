import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IConductorRepository } from '../../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../../dominio/entidades/conductor.entity.js';
import { ConductorOrmEntity } from '../entidades/conductor.orm-entity.js';

@Injectable()
export class ConductorRepositoryImpl implements IConductorRepository {
  constructor(
    @InjectRepository(ConductorOrmEntity)
    private readonly ormRepo: Repository<ConductorOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Conductor | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async obtenerPorEmail(email: string): Promise<Conductor | null> {
    const entity = await this.ormRepo.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async obtenerDisponibles(): Promise<Conductor[]> {
    const entities = await this.ormRepo.find({
      where: { estadoAprobacion: 'Aprobado', estadoDisponibilidad: 'Conectado' }
    });
    return entities.map(e => this.toDomain(e));
  }

  async guardar(conductor: Conductor): Promise<Conductor> {
    const entity = this.toOrm(conductor);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: ConductorOrmEntity): Conductor {
    return Conductor.crear({
      id: entity.id,
      nombreCompleto: entity.nombreCompleto,
      email: entity.email,
      telefono: entity.telefono,
      passwordHash: entity.passwordHash,
      fotoUrl: entity.fotoUrl ?? undefined,
      vehiculoMarca: entity.vehiculoMarca,
      vehiculoModelo: entity.vehiculoModelo,
      vehiculoColor: entity.vehiculoColor,
      vehiculoPlaca: entity.vehiculoPlaca,
      estadoAprobacion: entity.estadoAprobacion,
      estadoDisponibilidad: entity.estadoDisponibilidad,
      ultimaUbicacionLat: entity.ultimaUbicacionLat ?? undefined,
      ultimaUbicacionLng: entity.ultimaUbicacionLng ?? undefined,
    });
  }

  private toOrm(conductor: Conductor): Partial<ConductorOrmEntity> {
    return {
      id: conductor.id,
      nombreCompleto: conductor.nombreCompleto,
      email: conductor.email,
      telefono: conductor.telefono,
      passwordHash: conductor.passwordHash,
      fotoUrl: conductor.fotoUrl ?? undefined,
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
