import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IViajeRepository } from '../../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../../dominio/entidades/viaje.entity.js';
import { ViajeOrmEntity } from '../entidades/viaje.orm-entity.js';
import { ViajeOrmMapper } from '../mappers/viaje.orm-mapper.js';
import { EstadosViaje } from '../../../../../compartidos/constantes/estados-viaje.enum.js';
import { Roles } from '../../../../../compartidos/constantes/roles.enum.js';

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

  async listar(filtros?: { pasajeroId?: string; conductorId?: string }): Promise<Viaje[]> {
    const where: any = {};
    if (filtros?.pasajeroId) where.pasajeroId = filtros.pasajeroId;
    if (filtros?.conductorId) where.conductorId = filtros.conductorId;

    const entities = await this.ormRepo.find({ where });
    return entities.map(e => ViajeOrmMapper.toDomain(e));
  }

  async obtenerViajesVencidos(minutos: number): Promise<Viaje[]> {
    const fechaLimite = new Date(Date.now() - minutos * 60000);
    
    const entities = await this.ormRepo
      .createQueryBuilder('viaje')
      .where('viaje.estado = :estado', { estado: EstadosViaje.SOLICITADO })
      .andWhere('viaje.fechaSolicitud <= :fechaLimite', { fechaLimite })
      .getMany();
      
    return entities.map(e => ViajeOrmMapper.toDomain(e));
  }
}
