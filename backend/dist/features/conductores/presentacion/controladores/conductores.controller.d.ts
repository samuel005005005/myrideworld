import { CrearConductorUseCase } from '../../aplicacion/casos-uso/crear-conductor.use-case.js';
import type { CrearConductorDto } from '../../aplicacion/dto/crear-conductor.dto.js';
export declare class ConductoresController {
    private readonly crearConductor;
    constructor(crearConductor: CrearConductorUseCase);
    crear(dto: CrearConductorDto): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        estadoAprobacion: import("../../../../compartidos/constantes/estados-conductor.enum.js").EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-conductor.enum.js").EstadosDisponibilidadConductor;
        vehiculo: {
            marca: string;
            modelo: string;
            color: string;
            placa: string;
        };
    }>;
}
