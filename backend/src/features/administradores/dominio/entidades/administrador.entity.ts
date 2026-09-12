import { AdministradorProps } from './administrador.props.js';
import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

export class Administrador {
  private readonly _id: string;
  private _nombreCompleto: string;
  private _email: string;
  private _passwordHash: string;
  private _rolAdmin: RolesAdmin;
  private _activo: boolean;
  private readonly _fechaRegistro: Date;

  private constructor(props: AdministradorProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._nombreCompleto = props.nombreCompleto;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._rolAdmin = props.rolAdmin;
    this._activo = props.activo ?? true;
    this._fechaRegistro = props.fechaRegistro ?? new Date();
    this.validar();
  }

  static crear(props: AdministradorProps): Administrador {
    return new Administrador(props);
  }

  get id(): string {
    return this._id;
  }
  get nombreCompleto(): string {
    return this._nombreCompleto;
  }
  get email(): string {
    return this._email;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get rolAdmin(): RolesAdmin {
    return this._rolAdmin;
  }
  get activo(): boolean {
    return this._activo;
  }
  get fechaRegistro(): Date {
    return this._fechaRegistro;
  }

  actualizar(datos: {
    nombreCompleto?: string;
    rolAdmin?: RolesAdmin;
    passwordHash?: string;
  }): void {
    if (datos.nombreCompleto !== undefined) {
      this._nombreCompleto = datos.nombreCompleto;
    }
    if (datos.rolAdmin !== undefined) {
      this._rolAdmin = datos.rolAdmin;
    }
    if (datos.passwordHash !== undefined) {
      this._passwordHash = datos.passwordHash;
    }
    this.validar();
  }

  activar(): void {
    this._activo = true;
  }

  desactivar(): void {
    this._activo = false;
  }

  private validar(): void {
    if (!this._nombreCompleto?.trim()) {
      throw new DomainException(MENSAJES.EXCEPCIONES.COMUNES.NOMBRE_OBLIGATORIO);
    }
    if (!this._email?.includes('@')) {
      throw new DomainException(MENSAJES.EXCEPCIONES.COMUNES.EMAIL_INVALIDO);
    }
    if (!Object.values(RolesAdmin).includes(this._rolAdmin)) {
      throw new DomainException(MENSAJES.EXCEPCIONES.AUTH.ROL_INVALIDO);
    }
  }
}
