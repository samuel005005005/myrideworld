import { EstadosEjecucion } from '../../../../compartidos/constantes/estados-ejecucion.enum.js';

export interface DetalleEjecucionProcesoProps {
  id?: string;
  ejecucionProcesoId: string;
  entidadId?: string | null;
  estado?: EstadosEjecucion;
  fechaRegistro?: Date;
  jsonGenerado?: Record<string, any> | null;
  jsonRespuesta?: Record<string, any> | null;
  traceback?: string | null;
  valorClave: string;
}
