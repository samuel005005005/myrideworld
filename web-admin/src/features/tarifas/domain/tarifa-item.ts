export type EstadoTarifa = 'Activo' | 'Inactivo';

export interface TarifaItem {
  id: string;
  origen: string;
  destino: string;
  precio: number;
  estado: EstadoTarifa;
}
