import { Repository } from 'typeorm';
import { IViajeRepository } from '../../../dominio/repositorios/viaje.repository.js';
import { Viaje } from '../../../dominio/entidades/viaje.entity.js';
import { ViajeOrmEntity } from '../entidades/viaje.orm-entity.js';
export declare class ViajeRepositoryImpl implements IViajeRepository {
    private readonly ormRepo;
    constructor(ormRepo: Repository<ViajeOrmEntity>);
    obtenerPorId(id: string): Promise<Viaje | null>;
    obtenerPorPasajero(pasajeroId: string): Promise<Viaje[]>;
    obtenerPorConductor(conductorId: string): Promise<Viaje[]>;
    guardar(viaje: Viaje): Promise<Viaje>;
    private toDomain;
    private toOrm;
}
