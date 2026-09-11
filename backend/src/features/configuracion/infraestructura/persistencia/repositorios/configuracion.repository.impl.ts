import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IConfiguracionRepository } from '../../../dominio/repositorios/configuracion.repository.js';
import { Configuracion } from '../../../dominio/entidades/configuracion.entity.js';
import { ConfiguracionOrmEntity } from '../entidades/configuracion.orm-entity.js';

@Injectable()
export class ConfiguracionRepositoryImpl implements IConfiguracionRepository {
  constructor(
    @InjectRepository(ConfiguracionOrmEntity)
    private readonly ormRepo: Repository<ConfiguracionOrmEntity>,
  ) {}

  async obtenerValor(clave: string, defaultValue: string): Promise<string> {
    const entity = await this.ormRepo.findOne({ where: { clave } });
    if (entity) {
      return entity.valor;
    }

    // Upsert (Self-healing): Si no existe, lo creamos con el valor por defecto
    const nuevaConfig = Configuracion.crear({
      clave,
      valor: defaultValue,
      descripcion: `Valor por defecto auto-generado para ${clave}`,
    });

    await this.guardar(nuevaConfig);
    return defaultValue;
  }

  async guardar(configuracion: Configuracion): Promise<Configuracion> {
    const entity = this.toOrm(configuracion);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: ConfiguracionOrmEntity): Configuracion {
    return Configuracion.crear({
      id: entity.id,
      clave: entity.clave,
      valor: entity.valor,
      descripcion: entity.descripcion,
      actualizadoEn: entity.actualizadoEn,
    });
  }

  private toOrm(domain: Configuracion): Partial<ConfiguracionOrmEntity> {
    return {
      id: domain.id,
      clave: domain.clave,
      valor: domain.valor,
      descripcion: domain.descripcion,
      actualizadoEn: domain.actualizadoEn,
    };
  }
}
