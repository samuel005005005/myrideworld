import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ITarifaRepository } from '../../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../../dominio/entidades/tarifa.entity.js';
import { TarifaOrmEntity } from '../entidades/tarifa.orm-entity.js';
import { TarifaOrmMapper } from '../mappers/tarifa.orm-mapper.js';
import { EstadosTarifa } from '../../../../../compartidos/constantes/estados-tarifa.enum.js';

@Injectable()
export class TarifaRepositoryImpl implements ITarifaRepository {
  constructor(
    @InjectRepository(TarifaOrmEntity)
    private readonly ormRepo: Repository<TarifaOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Tarifa | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? TarifaOrmMapper.toDomain(entity) : null;
  }

  async obtenerTarifaActiva(origen: string, destino: string): Promise<Tarifa | null> {
    const entity = await this.ormRepo.findOne({
      where: { origen, destino, estado: EstadosTarifa.ACTIVO },
      order: { id: 'DESC' }, // Obtenemos la última
    });
    return entity ? TarifaOrmMapper.toDomain(entity) : null;
  }

  async guardar(tarifa: Tarifa): Promise<Tarifa> {
    const entity = TarifaOrmMapper.toOrm(tarifa);
    const saved = await this.ormRepo.save(entity);
    return TarifaOrmMapper.toDomain(saved);
  }
}
