import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IAdministradorRepository } from '../../../dominio/repositorios/administrador.repository.js';
import { Administrador } from '../../../dominio/entidades/administrador.entity.js';
import { AdministradorOrmEntity } from '../entidades/administrador.orm-entity.js';
import { AdministradorOrmMapper } from '../mappers/administrador.orm-mapper.js';

@Injectable()
export class AdministradorRepositoryImpl implements IAdministradorRepository {
  constructor(
    @InjectRepository(AdministradorOrmEntity)
    private readonly ormRepo: Repository<AdministradorOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Administrador | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? AdministradorOrmMapper.toDomain(entity) : null;
  }

  async obtenerPorEmail(email: string): Promise<Administrador | null> {
    const entity = await this.ormRepo.findOne({ where: { email } });
    return entity ? AdministradorOrmMapper.toDomain(entity) : null;
  }

  async listar(): Promise<Administrador[]> {
    const entities = await this.ormRepo.find({ order: { fechaRegistro: 'DESC' } });
    return entities.map((e) => AdministradorOrmMapper.toDomain(e));
  }

  async guardar(administrador: Administrador): Promise<Administrador> {
    const partial = AdministradorOrmMapper.toOrm(administrador);
    const saved = await this.ormRepo.save(partial as AdministradorOrmEntity);
    return AdministradorOrmMapper.toDomain(saved);
  }
}
