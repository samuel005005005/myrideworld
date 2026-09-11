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
  ) { }

  async obtenerValor(clave: string, defaultValue: string): Promise<string> {
    const entity = await this.ormRepo.findOne({ where: { clave } });
    if (entity) {
      return entity.valor;
    }

    // Upsert (Self-healing): Si no existe, lo creamos con el valor por defecto
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
