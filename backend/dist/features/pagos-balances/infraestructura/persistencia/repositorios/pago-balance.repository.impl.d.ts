import { Repository } from 'typeorm';
import { IPagoBalanceRepository } from '../../../dominio/repositorios/pago-balance.repository.js';
import { PagoBalance } from '../../../dominio/entidades/pago-balance.entity.js';
import { PagoBalanceOrmEntity } from '../entidades/pago-balance.orm-entity.js';
export declare class PagoBalanceRepositoryImpl implements IPagoBalanceRepository {
    private readonly ormRepo;
    constructor(ormRepo: Repository<PagoBalanceOrmEntity>);
    obtenerPorId(id: string): Promise<PagoBalance | null>;
    obtenerPorViaje(viajeId: string): Promise<PagoBalance | null>;
    obtenerPorConductor(conductorId: string): Promise<PagoBalance[]>;
    guardar(pago: PagoBalance): Promise<PagoBalance>;
}
