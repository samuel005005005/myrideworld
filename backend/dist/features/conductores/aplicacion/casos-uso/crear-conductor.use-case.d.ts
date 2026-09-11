import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { CrearConductorDto } from '../dto/crear-conductor.dto.js';
export declare class CrearConductorUseCase {
    private readonly conductorRepository;
    constructor(conductorRepository: IConductorRepository);
    ejecutar(dto: CrearConductorDto): Promise<Conductor>;
}
