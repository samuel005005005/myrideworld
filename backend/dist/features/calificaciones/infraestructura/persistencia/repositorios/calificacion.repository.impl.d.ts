import { Repository } from 'typeorm';
import { ICalificacionRepository } from '../../../dominio/repositorios/calificacion.repository.js';
import { Calificacion } from '../../../dominio/entidades/calificacion.entity.js';
import { CalificacionOrmEntity } from '../entidades/calificacion.orm-entity.js';
export declare class CalificacionRepositoryImpl implements ICalificacionRepository {
    private readonly ormRepo;
    constructor(ormRepo: Repository<CalificacionOrmEntity>);
    guardar(calificacion: Calificacion): Promise<Calificacion>;
    existeCalificacion(viajeId: string): Promise<boolean>;
    private toDomain;
    private toOrm;
}
