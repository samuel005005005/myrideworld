import { Repository } from 'typeorm';
import { ITarifaRepository } from '../../../dominio/repositorios/tarifa.repository.js';
import { Tarifa } from '../../../dominio/entidades/tarifa.entity.js';
import { TarifaOrmEntity } from '../entidades/tarifa.orm-entity.js';
export declare class TarifaRepositoryImpl implements ITarifaRepository {
    private readonly ormRepo;
    constructor(ormRepo: Repository<TarifaOrmEntity>);
    obtenerPorId(id: string): Promise<Tarifa | null>;
    obtenerTarifaActiva(origen: string, destino: string): Promise<Tarifa | null>;
    guardar(tarifa: Tarifa): Promise<Tarifa>;
}
