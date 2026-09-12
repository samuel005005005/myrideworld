import type { IConductorRepository } from '../../dominio/repositorios/conductor.repository.js';
import { Conductor } from '../../dominio/entidades/conductor.entity.js';
import { CrearConductorDto } from '../dto/crear-conductor.dto.js';
import type { IHasheadorPassword } from '../../../../compartidos/seguridad/hasheador-password.port.js';
export declare class CrearConductorUseCase {
    private readonly conductorRepository;
    private readonly hasheadorPassword;
    constructor(conductorRepository: IConductorRepository, hasheadorPassword: IHasheadorPassword);
    ejecutar(dto: CrearConductorDto): Promise<Conductor>;
}
