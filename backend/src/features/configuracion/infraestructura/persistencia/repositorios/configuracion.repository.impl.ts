import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IConfiguracionRepository } from '../../../dominio/repositorios/configuracion.repository.js';
import { Configuracion } from '../../../dominio/entidades/configuracion.entity.js';
import { ConfiguracionOrmEntity } from '../entidades/configuracion.orm-entity.js';
import { ConfiguracionOrmMapper } from '../mappers/configuracion.orm-mapper.js';
import { MENSAJES } from '../../../../../compartidos/constantes/mensajes.const.js';

@Injectable()
export class ConfiguracionRepositoryImpl implements IConfiguracionRepository {
  constructor(
    @InjectRepository(ConfiguracionOrmEntity)
    private readonly ormRepo: Repository<ConfiguracionOrmEntity>,
  ) {}

  async obtenerPorClave(clave: string): Promise<Configuracion | null> {
    const entity = await this.ormRepo.findOne({ where: { clave } });
    return entity ? ConfiguracionOrmMapper.toDomain(entity) : null;
  }

  async listar(): Promise<Configuracion[]> {
    const entities = await this.ormRepo.find({ order: { clave: 'ASC' } });
    return entities.map((entity) => ConfiguracionOrmMapper.toDomain(entity));
  }

  async obtenerValor(clave: string, defaultValue: string): Promise<string> {
    const existente = await this.obtenerPorClave(clave);
    if (existente) {
      return existente.valor;
    }

    // Solo para claves legadas no sembradas: auto-crea con default técnico.
    const nuevaConfig = Configuracion.crear({
      clave,
      valor: defaultValue,
      descripcion: MENSAJES.INFRAESTRUCTURA.CONFIGURACION.VALOR_POR_DEFECTO(clave),
    });

    await this.guardar(nuevaConfig);
    return defaultValue;
  }

  async guardar(configuracion: Configuracion): Promise<Configuracion> {
    const entity = ConfiguracionOrmMapper.toOrm(configuracion);
    const saved = await this.ormRepo.save(entity);
    return ConfiguracionOrmMapper.toDomain(saved);
  }
}
