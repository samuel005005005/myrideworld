import { ICalificacionRepository } from '../../dominio/repositorios/calificacion.repository.js';
import { Calificacion } from '../../dominio/entidades/calificacion.entity.js';
import { CalificarConductorDto } from '../dto/calificar-conductor.dto.js';
import { IViajeRepository } from '../../../viajes/dominio/repositorios/viaje.repository.js';
export declare class CalificarConductorUseCase {
    private readonly calificacionRepository;
    private readonly viajeRepository;
    constructor(calificacionRepository: ICalificacionRepository, viajeRepository: IViajeRepository);
    ejecutar(pasajeroId: string, dto: CalificarConductorDto): Promise<Calificacion>;
}
