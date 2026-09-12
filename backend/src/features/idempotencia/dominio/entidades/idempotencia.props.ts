import { EstadoIdempotencia } from './estado-idempotencia.enum.js';

export interface IdempotenciaProps {
  id?: string;
  llave: string;
  url: string;
  cuerpoPeticionHash?: string;
  respuesta?: any;
  codigoEstado?: number;
  estado?: EstadoIdempotencia;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}
