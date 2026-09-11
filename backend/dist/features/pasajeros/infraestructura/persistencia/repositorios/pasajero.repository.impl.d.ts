import { Repository } from 'typeorm';
import { IPasajeroRepository } from '../../../dominio/repositorios/pasajero.repository.js';
import { Pasajero } from '../../../dominio/entidades/pasajero.entity.js';
import { PasajeroOrmEntity } from '../entidades/pasajero.orm-entity.js';
export declare class PasajeroRepositoryImpl implements IPasajeroRepository {
    private readonly ormRepo;
    constructor(ormRepo: Repository<PasajeroOrmEntity>);
    obtenerPorId(id: string): Promise<Pasajero | null>;
    obtenerPorEmail(email: string): Promise<Pasajero | null>;
    guardar(pasajero: Pasajero): Promise<Pasajero>;
    private toDomain;
    private toOrm;
}
