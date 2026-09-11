import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ITarifaRepository } from '../../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../../dominio/entidades/tarifa.entity.js';
import { TarifaOrmEntity } from '../entidades/tarifa.orm-entity.js';
import { EstadosTarifa } from '../../../../../compartidos/constantes/estados-tarifa.enum.js';

@Injectable()
export class TarifaRepositoryImpl implements ITarifaRepository {
  constructor(
    @InjectRepository(TarifaOrmEntity)
    private readonly ormRepo: Repository<TarifaOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Tarifa | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async obtenerTarifaActiva(origen: string, destino: string): Promise<Tarifa | null> {
    const entity = await this.ormRepo.findOne({
      where: { origen, destino, estado: EstadosTarifa.ACTIVO },
      order: { id: 'DESC' }, // Obtenemos la última
    });
    return entity ? this.toDomain(entity) : null;
  }

  async guardar(tarifa: Tarifa): Promise<Tarifa> {
    const entity = this.toOrm(tarifa);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: TarifaOrmEntity): Tarifa {
    return Tarifa.crear({
      id: entity.id,
      origen: entity.origen,
      destino: entity.destino,
      precio: Number(entity.precio),
      estado: entity.estado as EstadosTarifa,
    });
  }

  private toOrm(tarifa: Tarifa): Partial<TarifaOrmEntity> {
    return {
      id: tarifa.id,
      origen: tarifa.origen,
      destino: tarifa.destino,
      precio: tarifa.precio,
      estado: tarifa.estado,
    };
  }
}
