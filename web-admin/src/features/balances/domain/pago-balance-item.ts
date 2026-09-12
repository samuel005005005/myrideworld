export interface PagoBalanceItem {
  id: string;
  viajeId: string;
  conductorId: string;
  montoBruto: number;
  feeProcesamiento: number;
  montoNeto: number;
  metodo: string;
  fecha: string;
}
