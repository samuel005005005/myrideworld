import { PagoBalanceProps } from './pago-balance.props.js';
export declare class PagoBalance {
    private readonly _id;
    private readonly _viajeId;
    private readonly _conductorId;
    private readonly _montoBruto;
    private readonly _feeProcesamiento;
    private readonly _montoNeto;
    private readonly _metodo;
    private readonly _fecha;
    private constructor();
    static crear(props: PagoBalanceProps): PagoBalance;
    get id(): string;
    get viajeId(): string;
    get conductorId(): string;
    get montoBruto(): number;
    get feeProcesamiento(): number;
    get montoNeto(): number;
    get metodo(): string;
    get fecha(): Date;
    private validar;
}
