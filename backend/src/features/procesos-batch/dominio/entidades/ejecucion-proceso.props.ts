import { EstadosEjecucion } from '../../../../compartidos/constantes/estados-ejecucion.enum.js';

export interface EjecucionProcesoProps {
  id?: string;
  proceso: string;
  estado?: EstadosEjecucion;
  fechaInicio?: Date;
  fechaFin?: Date | null;
  totalRegistros: number;
  registrosProcesados?: number;
  registrosError?: number;
  detalle?: string | null;
  usuario: string;
}
