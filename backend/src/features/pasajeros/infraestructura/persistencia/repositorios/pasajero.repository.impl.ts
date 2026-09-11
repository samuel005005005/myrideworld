import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPasajeroRepository } from '../../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../../dominio/entidades/pasajero.entity.js';
import { PasajeroOrmEntity } from '../entidades/pasajero.orm-entity.js';
import { EstadosPasajero } from '../../../../../compartidos/constantes/estados-pasajero.enum.js';

@Injectable()
export class PasajeroRepositoryImpl implements IPasajeroRepository {
  constructor(
    @InjectRepository(PasajeroOrmEntity)
    private readonly ormRepo: Repository<PasajeroOrmEntity>,
  ) {}

  async obtenerPorId(id: string): Promise<Pasajero | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async obtenerPorEmail(email: string): Promise<Pasajero | null> {
    const entity = await this.ormRepo.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async guardar(pasajero: Pasajero): Promise<Pasajero> {
    const entity = this.toOrm(pasajero);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: PasajeroOrmEntity): Pasajero {
    return Pasajero.crear({
      id: entity.id,
      nombreCompleto: entity.nombreCompleto,
      email: entity.email,
      telefono: entity.telefono,
      passwordHash: entity.passwordHash,
      fechaRegistro: entity.fechaRegistro,
      estado: entity.estado as EstadosPasajero,
    });
  }

  private toOrm(pasajero: Pasajero): Partial<PasajeroOrmEntity> {
    return {
      id: pasajero.id,
      nombreCompleto: pasajero.nombreCompleto,
      email: pasajero.email,
      telefono: pasajero.telefono,
      passwordHash: pasajero.passwordHash,
      estado: pasajero.estado,
    };
  }
}
