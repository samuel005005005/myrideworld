import { EstadosTarifa } from '../../../../compartidos/constantes/estados-tarifa.enum.js';

export interface TarifaProps {
  id?: string;
  origen: string;
  destino: string;
  precio: number;
  estado?: EstadosTarifa;
}
