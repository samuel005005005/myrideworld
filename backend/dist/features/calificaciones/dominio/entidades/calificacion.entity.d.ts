import { CalificacionProps } from './calificacion.props.js';
export declare class Calificacion {
    private readonly _id;
    private _viajeId;
    private _pasajeroId;
    private _conductorId;
    private _puntuacion;
    private _comentario;
    private readonly _fecha;
    private constructor();
    static crear(props: CalificacionProps): Calificacion;
    get id(): string;
    get viajeId(): string;
    get pasajeroId(): string;
    get conductorId(): string;
    get puntuacion(): number;
    get comentario(): string | null;
    get fecha(): Date;
    private validar;
}
