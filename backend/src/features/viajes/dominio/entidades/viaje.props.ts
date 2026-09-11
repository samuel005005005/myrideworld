import { EstadosViaje } from '../../../../compartidos/constantes/estados-viaje.enum.js';
import { Roles } from '../../../../compartidos/constantes/roles.enum.js';

export interface ViajeProps {
  id?: string;
  pasajeroId: string;
  conductorId?: string;
  origenLat: number;
  origenLng: number;
  destinoLat: number;
  destinoLng: number;
  estado?: EstadosViaje;
  tarifaEstimada: number;
  metodoPago?: string | null;
  canceladoPor?: Roles | null;
  motivoCancelacion?: string | null;
  fechaSolicitud?: Date;
  fechaInicio?: Date;
  fechaFin?: Date;
}
