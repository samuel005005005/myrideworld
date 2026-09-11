import { Repository } from 'typeorm';
import { IConductorRepository } from '../../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../../dominio/entidades/conductor.entity.js';
import { ConductorOrmEntity } from '../entidades/conductor.orm-entity.js';
import { EstadosConductor } from '../../../../../compartidos/constantes/estados-conductor.enum.js';
export declare class ConductorRepositoryImpl implements IConductorRepository {
    private readonly ormRepo;
    constructor(ormRepo: Repository<ConductorOrmEntity>);
    obtenerPorId(id: string): Promise<Conductor | null>;
    obtenerPorEmail(email: string): Promise<Conductor | null>;
    obtenerDisponibles(): Promise<Conductor[]>;
    guardar(conductor: Conductor): Promise<Conductor>;
    listar(filtros?: {
        estadoAprobacion?: EstadosConductor;
    }): Promise<Conductor[]>;
}
