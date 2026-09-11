import { PasajeroProps } from './pasajero.props.js';
export declare class Pasajero {
    private readonly _id;
    private _nombreCompleto;
    private _email;
    private _telefono;
    private _passwordHash;
    private readonly _fechaRegistro;
    private _estado;
    private constructor();
    static crear(props: PasajeroProps): Pasajero;
    get id(): string;
    get nombreCompleto(): string;
    get email(): string;
    get estado(): string;
    get telefono(): string;
    get passwordHash(): string;
    get fechaRegistro(): Date;
    private validar;
}
