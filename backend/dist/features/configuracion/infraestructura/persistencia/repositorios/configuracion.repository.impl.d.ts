import { Repository } from 'typeorm';
import { IConfiguracionRepository } from '../../../dominio/repositorios/configuracion.repository.js';
import { Configuracion } from '../../../dominio/entidades/configuracion.entity.js';
import { ConfiguracionOrmEntity } from '../entidades/configuracion.orm-entity.js';
export declare class ConfiguracionRepositoryImpl implements IConfiguracionRepository {
    private readonly ormRepo;
    constructor(ormRepo: Repository<ConfiguracionOrmEntity>);
    obtenerValor(clave: string, defaultValue: string): Promise<string>;
    guardar(configuracion: Configuracion): Promise<Configuracion>;
}
