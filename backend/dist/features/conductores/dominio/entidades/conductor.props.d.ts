import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';
export interface ConductorProps {
    id?: string;
    nombreCompleto: string;
    email: string;
    telefono: string;
    passwordHash: string;
    fotoUrl?: string;
    vehiculoMarca: string;
    vehiculoModelo: string;
    vehiculoColor: string;
    vehiculoPlaca: string;
    licenciaUrl?: string;
    seguroUrl?: string;
    estadoAprobacion?: EstadosConductor;
    estadoDisponibilidad?: EstadosDisponibilidadConductor;
    ultimaUbicacionLat?: number | null;
    ultimaUbicacionLng?: number;
}
