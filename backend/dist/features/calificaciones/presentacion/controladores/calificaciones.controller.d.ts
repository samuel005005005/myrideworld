import { CalificarConductorUseCase } from '../../aplicacion/casos-uso/calificar-conductor.use-case.js';
import { CalificarConductorDto } from '../../aplicacion/dto/calificar-conductor.dto.js';
export declare class CalificacionesController {
    private readonly calificarConductor;
    constructor(calificarConductor: CalificarConductorUseCase);
    calificar(dto: CalificarConductorDto, req: any): Promise<import("../../dominio/entidades/calificacion.entity.js").Calificacion>;
}
