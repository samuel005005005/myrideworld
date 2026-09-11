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
    estadoAprobacion?: string;
    estadoDisponibilidad?: string;
    ultimaUbicacionLat?: number;
    ultimaUbicacionLng?: number;
}
