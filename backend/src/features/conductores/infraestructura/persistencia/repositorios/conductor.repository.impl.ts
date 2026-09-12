import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IConductorRepository } from '../../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../../dominio/entidades/conductor.entity.js';
import { ConductorOrmEntity } from '../entidades/conductor.orm-entity.js';
import { EstadosConductor } from '../../../../../compartidos/constantes/estados-conductor.enum.js';
import { ConductorOrmMapper } from '../mappers/conductor.orm-mapper.js';

@Injectable()
export class ConductorRepositoryImpl implements IConductorRepository {
  constructor(
    @InjectRepository(ConductorOrmEntity)
    private readonly ormRepo: Repository<ConductorOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Conductor | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? ConductorOrmMapper.toDomain(entity) : null;
  }

  async obtenerPorEmail(email: string): Promise<Conductor | null> {
    const entity = await this.ormRepo.findOne({ where: { email } });
    return entity ? ConductorOrmMapper.toDomain(entity) : null;
  }

  async obtenerDisponibles(): Promise<Conductor[]> {
    const entities = await this.ormRepo.find({
      where: { estadoAprobacion: 'Aprobado', estadoDisponibilidad: 'Conectado' },
    });
    return entities.map((e) => ConductorOrmMapper.toDomain(e));
  }

  async obtenerDisponiblesCercanos(
    lat: number,
    lng: number,
    radioKm: number,
  ): Promise<Conductor[]> {
    const deltaLat = radioKm / 111;
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const deltaLng = radioKm / (111 * Math.max(cosLat, 0.01));

    const entities = await this.ormRepo
      .createQueryBuilder('c')
      .where('c.estadoAprobacion = :aprobacion', { aprobacion: 'Aprobado' })
      .andWhere('c.estadoDisponibilidad = :disponibilidad', {
        disponibilidad: 'Conectado',
      })
      .andWhere('c.ultimaUbicacionLat IS NOT NULL')
      .andWhere('c.ultimaUbicacionLng IS NOT NULL')
      .andWhere('c.ultimaUbicacionLat BETWEEN :latMin AND :latMax', {
        latMin: lat - deltaLat,
        latMax: lat + deltaLat,
      })
      .andWhere('c.ultimaUbicacionLng BETWEEN :lngMin AND :lngMax', {
        lngMin: lng - deltaLng,
        lngMax: lng + deltaLng,
      })
      .take(100)
      .getMany();

    return entities.map((e) => ConductorOrmMapper.toDomain(e));
  }

  async guardar(conductor: Conductor): Promise<Conductor> {
    const entity = ConductorOrmMapper.toOrm(conductor);
    const saved = await this.ormRepo.save(entity);
    return ConductorOrmMapper.toDomain(saved);
  }

  async listar(filtros?: { estadoAprobacion?: EstadosConductor }): Promise<Conductor[]> {
    const whereClause = filtros?.estadoAprobacion ? { estadoAprobacion: filtros.estadoAprobacion } : {};
    const entities = await this.ormRepo.find({ where: whereClause, order: { id: 'DESC' } });
    return entities.map(e => ConductorOrmMapper.toDomain(e));
  }

  async contarPorDisponibilidad(estadoDisponibilidad: string): Promise<number> {
    return this.ormRepo.count({
      where: {
        estadoAprobacion: EstadosConductor.APROBADO,
        estadoDisponibilidad,
      },
    });
  }
}
