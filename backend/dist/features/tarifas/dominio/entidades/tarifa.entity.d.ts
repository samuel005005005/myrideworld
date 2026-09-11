import { TarifaProps } from './tarifa.props.js';
export declare class Tarifa {
    private readonly _id;
    private _origen;
    private _destino;
    private _precio;
    private _estado;
    private constructor();
    static crear(props: TarifaProps): Tarifa;
    get id(): string;
    get origen(): string;
    get destino(): string;
    get precio(): number;
    get estado(): string;
    private validar;
}
