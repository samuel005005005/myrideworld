import type { ObjetoJson } from '../../../../compartidos/tipos/objeto-json.js';
import { EstadosEjecucion } from '../../../../compartidos/constantes/estados-ejecucion.enum.js';

export interface DetalleEjecucionProcesoProps {
  id?: string;
  ejecucionProcesoId: string;
  entidadId?: string | null;
  estado?: EstadosEjecucion;
  fechaRegistro?: Date;
  jsonGenerado?: ObjetoJson | null;
  jsonRespuesta?: ObjetoJson | null;
  traceback?: string | null;
  valorClave: string;
}
