import { CrearConductorUseCase } from '../../aplicacion/casos-uso/crear-conductor.use-case.js';
import type { CrearConductorDto } from '../../aplicacion/dto/crear-conductor.dto.js';
import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
import { AprobarConductorUseCase } from '../../aplicacion/casos-uso/aprobar-conductor.use-case.js';
import { ListarConductoresUseCase } from '../../aplicacion/casos-uso/listar-conductores.use-case.js';
export declare class ConductoresController {
    private readonly crearConductor;
    private readonly aprobarConductor;
    private readonly listarConductores;
    constructor(crearConductor: CrearConductorUseCase, aprobarConductor: AprobarConductorUseCase, listarConductores: ListarConductoresUseCase);
    crear(dto: CrearConductorDto): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        estadoAprobacion: EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-conductor.enum.js").EstadosDisponibilidadConductor;
        vehiculo: {
            marca: string;
            modelo: string;
            color: string;
            placa: string;
        };
    }>;
    listar(estado?: EstadosConductor): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        estadoAprobacion: EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-conductor.enum.js").EstadosDisponibilidadConductor;
    }[]>;
    aprobar(id: string): Promise<{
        id: string;
        estadoAprobacion: EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-conductor.enum.js").EstadosDisponibilidadConductor;
    }>;
}
