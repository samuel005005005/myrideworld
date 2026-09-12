import type { ObjetoJson } from '../../../../compartidos/tipos/objeto-json.js';
import { TiposBitacora } from '../../../../compartidos/constantes/tipos-bitacora.enum.js';
import { ServiciosSistema } from '../../../../compartidos/constantes/servicios-sistema.enum.js';

export interface RegistrarBitacoraDto {
  tipoEvento: TiposBitacora;
  servicioSistema: ServiciosSistema;
  detalle: string;
  criterioConsulta?: ObjetoJson;
  request?: ObjetoJson;
  response?: ObjetoJson;
  usuario: string;
  ip?: string;
  entidadId?: string;
  accion: string;
  duracionMs?: number;
}
