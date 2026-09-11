export interface CalificacionProps {
    id?: string;
    viajeId: string;
    pasajeroId: string;
    conductorId: string;
    puntuacion: number;
    comentario?: string | null;
    fecha?: Date;
}
