import { TiposBitacora } from '../../../../compartidos/constantes/tipos-bitacora.enum.js';
import { ServiciosSistema } from '../../../../compartidos/constantes/servicios-sistema.enum.js';

export interface BitacoraProps {
  id?: string;
  tipoEvento: TiposBitacora;
  servicioSistema: ServiciosSistema;
  detalle: string;
  criterioConsulta?: Record<string, any>;
  request?: Record<string, any>;
  response?: Record<string, any>;
  usuario: string;
  fecha?: Date;
  ip?: string;
  entidadId?: string;
  accion: string;
  duracionMs?: number;
}
