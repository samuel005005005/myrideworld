import { CrearConductorUseCase } from '../../aplicacion/casos-uso/crear-conductor.use-case.js';
import type { CrearConductorDto } from '../../aplicacion/dto/crear-conductor.dto.js';
import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
import { AprobarConductorUseCase } from '../../aplicacion/casos-uso/aprobar-conductor.use-case.js';
import { ListarConductoresUseCase } from '../../aplicacion/casos-uso/listar-conductores.use-case.js';
import { SubirDocumentosUseCase } from '../../aplicacion/casos-uso/subir-documentos.use-case.js';
import { ObtenerConductorUseCase } from '../../aplicacion/casos-uso/obtener-conductor.use-case.js';
import { ActualizarConductorUseCase } from '../../aplicacion/casos-uso/actualizar-conductor.use-case.js';
import { ActualizarConductorDto } from '../../aplicacion/dto/actualizar-conductor.dto.js';
export declare class ConductoresController {
    private readonly crearConductor;
    private readonly aprobarConductor;
    private readonly listarConductores;
    private readonly subirDocumentos;
    private readonly obtenerConductor;
    private readonly actualizarConductor;
    constructor(crearConductor: CrearConductorUseCase, aprobarConductor: AprobarConductorUseCase, listarConductores: ListarConductoresUseCase, subirDocumentos: SubirDocumentosUseCase, obtenerConductor: ObtenerConductorUseCase, actualizarConductor: ActualizarConductorUseCase);
    crear(dto: CrearConductorDto): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        fotoUrl: string | null;
        licenciaUrl: string | null;
        seguroUrl: string | null;
        estadoAprobacion: EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js").EstadosDisponibilidadConductor;
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
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js").EstadosDisponibilidadConductor;
    }[]>;
    aprobar(id: string): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        estadoAprobacion: EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js").EstadosDisponibilidadConductor;
    }>;
    subirDocumentosEndpoint(id: string, files: {
        fotoPerfil?: Express.Multer.File[];
        licencia?: Express.Multer.File[];
        seguro?: Express.Multer.File[];
    }): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        fotoUrl: string | null;
        licenciaUrl: string | null;
        seguroUrl: string | null;
        estadoAprobacion: EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js").EstadosDisponibilidadConductor;
        vehiculo: {
            marca: string;
            modelo: string;
            color: string;
            placa: string;
        };
    }>;
    obtenerPerfil(req: any): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        fotoUrl: string | null;
        licenciaUrl: string | null;
        seguroUrl: string | null;
        estadoAprobacion: EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js").EstadosDisponibilidadConductor;
        vehiculo: {
            marca: string;
            modelo: string;
            color: string;
            placa: string;
        };
    }>;
    actualizarPerfil(req: any, dto: ActualizarConductorDto): Promise<{
        id: string;
        nombreCompleto: string;
        email: string;
        telefono: string;
        fotoUrl: string | null;
        licenciaUrl: string | null;
        seguroUrl: string | null;
        estadoAprobacion: EstadosConductor;
        estadoDisponibilidad: import("../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js").EstadosDisponibilidadConductor;
        vehiculo: {
            marca: string;
            modelo: string;
            color: string;
            placa: string;
        };
    }>;
}
