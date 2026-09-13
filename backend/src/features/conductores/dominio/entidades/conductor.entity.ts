import { ConductorProps } from './conductor.props.js';
import { EstadosConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';
import { EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-disponibilidad-conductor.enum.js';
import { DomainException } from '../../../../compartidos/excepciones/domain.exception.js';
import { MENSAJES } from '../../../../compartidos/constantes/mensajes.const.js';

export class Conductor {
  private readonly _id: string;
  private _nombreCompleto: string;
  private _email: string;
  private _telefono: string;
  private _passwordHash: string;
  private _fotoUrl: string | null;
  private _vehiculoMarca: string;
  private _vehiculoModelo: string;
  private _vehiculoColor: string;
  private _vehiculoPlaca: string;
  private _licenciaUrl: string | null;
  private _seguroUrl: string | null;
  private _estadoAprobacion: EstadosConductor;
  private _estadoDisponibilidad: EstadosDisponibilidadConductor;
  private _ultimaUbicacionLat: number | null;
  private _ultimaUbicacionLng: number | null;
  private _tokenPushFcm: string | null;

  private constructor(props: ConductorProps) {
    this._id = props.id ?? crypto.randomUUID();
    this._nombreCompleto = props.nombreCompleto;
    this._email = props.email;
    this._telefono = props.telefono;
    this._passwordHash = props.passwordHash;
    this._fotoUrl = props.fotoUrl ?? null;
    this._vehiculoMarca = props.vehiculoMarca;
    this._vehiculoModelo = props.vehiculoModelo;
    this._vehiculoColor = props.vehiculoColor;
    this._vehiculoPlaca = props.vehiculoPlaca;
    this._licenciaUrl = props.licenciaUrl ?? null;
    this._seguroUrl = props.seguroUrl ?? null;
    this._estadoAprobacion = props.estadoAprobacion ?? EstadosConductor.PENDIENTE;
    this._estadoDisponibilidad = props.estadoDisponibilidad ?? EstadosDisponibilidadConductor.DESCONECTADO;
    this._ultimaUbicacionLat = props.ultimaUbicacionLat ?? null;
    this._ultimaUbicacionLng = props.ultimaUbicacionLng ?? null;
    this._tokenPushFcm = props.tokenPushFcm ?? null;

    this.validar();
  }

  static crear(props: ConductorProps): Conductor {
    return new Conductor(props);
  }

  get id(): string { return this._id; }
  get nombreCompleto(): string { return this._nombreCompleto; }
  get email(): string { return this._email; }
  get telefono(): string { return this._telefono; }
  get passwordHash(): string { return this._passwordHash; }
  get fotoUrl(): string | null { return this._fotoUrl; }
  get vehiculoMarca(): string { return this._vehiculoMarca; }
  get vehiculoModelo(): string { return this._vehiculoModelo; }
  get vehiculoColor(): string { return this._vehiculoColor; }
  get vehiculoPlaca(): string { return this._vehiculoPlaca; }
  get licenciaUrl(): string | null { return this._licenciaUrl; }
  get seguroUrl(): string | null { return this._seguroUrl; }
  get estadoAprobacion(): EstadosConductor { return this._estadoAprobacion; }
  get estadoDisponibilidad(): EstadosDisponibilidadConductor { return this._estadoDisponibilidad; }
  get ultimaUbicacionLat(): number | null { return this._ultimaUbicacionLat; }
  get ultimaUbicacionLng(): number | null { return this._ultimaUbicacionLng; }
  get tokenPushFcm(): string | null { return this._tokenPushFcm; }

  registrarTokenPush(token: string | null): void {
    const normalizado = token?.trim() || null;
    this._tokenPushFcm = normalizado;
  }

  aprobar(): void {
    if (this._estadoAprobacion !== EstadosConductor.PENDIENTE) {
      throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.SOLO_PENDIENTE_APROBAR);
    }
    this._estadoAprobacion = EstadosConductor.APROBADO;
    this._estadoDisponibilidad = EstadosDisponibilidadConductor.CONECTADO;
  }

  rechazar(): void {
    if (this._estadoAprobacion !== EstadosConductor.PENDIENTE) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONDUCTORES_FLOTA.SOLO_PENDIENTE_RECHAZAR,
      );
    }
    this._estadoAprobacion = EstadosConductor.RECHAZADO;
    this._estadoDisponibilidad = EstadosDisponibilidadConductor.DESCONECTADO;
  }

  suspender(): void {
    if (this._estadoAprobacion !== EstadosConductor.APROBADO) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONDUCTORES_FLOTA.SOLO_APROBADO_SUSPENDER,
      );
    }
    this._estadoAprobacion = EstadosConductor.SUSPENDIDO;
    this._estadoDisponibilidad = EstadosDisponibilidadConductor.DESCONECTADO;
  }

  reactivar(): void {
    if (this._estadoAprobacion !== EstadosConductor.SUSPENDIDO) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONDUCTORES_FLOTA.SOLO_SUSPENDIDO_REACTIVAR,
      );
    }
    this._estadoAprobacion = EstadosConductor.APROBADO;
    this._estadoDisponibilidad = EstadosDisponibilidadConductor.DESCONECTADO;
  }

  actualizarDocumentos(rutas: { fotoPerfil?: string; licencia?: string; seguro?: string }): void {
    if (rutas.fotoPerfil) this._fotoUrl = rutas.fotoPerfil;
    if (rutas.licencia) this._licenciaUrl = rutas.licencia;
    if (rutas.seguro) this._seguroUrl = rutas.seguro;
  }

  actualizarPerfil(datos: {
    nombreCompleto?: string;
    telefono?: string;
    vehiculoMarca?: string;
    vehiculoModelo?: string;
    vehiculoColor?: string;
    vehiculoPlaca?: string;
  }): void {
    if (datos.nombreCompleto) this._nombreCompleto = datos.nombreCompleto;
    if (datos.telefono) this._telefono = datos.telefono;
    if (datos.vehiculoMarca) this._vehiculoMarca = datos.vehiculoMarca;
    if (datos.vehiculoModelo) this._vehiculoModelo = datos.vehiculoModelo;
    if (datos.vehiculoColor) this._vehiculoColor = datos.vehiculoColor;
    if (datos.vehiculoPlaca) this._vehiculoPlaca = datos.vehiculoPlaca;
    this.validar();
  }

  actualizarUbicacion(lat: number, lng: number): void {
    this._ultimaUbicacionLat = lat;
    this._ultimaUbicacionLng = lng;
  }

  actualizarDisponibilidad(estado: EstadosDisponibilidadConductor): void {
    if (
      estado !== EstadosDisponibilidadConductor.CONECTADO &&
      estado !== EstadosDisponibilidadConductor.DESCONECTADO
    ) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONDUCTORES.DISPONIBILIDAD_INVALIDA,
      );
    }

    if (
      estado === EstadosDisponibilidadConductor.CONECTADO &&
      this._estadoAprobacion !== EstadosConductor.APROBADO
    ) {
      throw new DomainException(
        MENSAJES.EXCEPCIONES.CONDUCTORES.SOLO_APROBADO_CONECTAR,
      );
    }

    this._estadoDisponibilidad = estado;
  }

  private validar(): void {
    if (!this._nombreCompleto?.trim()) throw new DomainException(MENSAJES.EXCEPCIONES.COMUNES.NOMBRE_OBLIGATORIO);
    if (!this._email?.includes('@')) throw new DomainException(MENSAJES.EXCEPCIONES.COMUNES.EMAIL_INVALIDO);
    if (!this._vehiculoPlaca?.trim()) throw new DomainException(MENSAJES.EXCEPCIONES.CONDUCTORES.PLACA_OBLIGATORIA);
  }
}
