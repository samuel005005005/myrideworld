import { ConfiguracionProps } from './configuracion.props.js';
export declare class Configuracion {
    private readonly _id;
    private readonly _clave;
    private _valor;
    private _descripcion;
    private _actualizadoEn;
    private constructor();
    static crear(props: ConfiguracionProps): Configuracion;
    get id(): string;
    get clave(): string;
    get valor(): string;
    get descripcion(): string;
    get actualizadoEn(): Date;
    actualizarValor(nuevoValor: string): void;
    private validar;
}
