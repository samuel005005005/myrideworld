export interface ViajeProps {
    id?: string;
    pasajeroId: string;
    conductorId?: string;
    origenLat: number;
    origenLng: number;
    destinoLat: number;
    destinoLng: number;
    estado?: string;
    tarifaEstimada: number;
    metodoPago?: string | null;
    canceladoPor?: string | null;
    motivoCancelacion?: string | null;
    fechaSolicitud?: Date;
    fechaInicio?: Date;
    fechaFin?: Date;
}
