import { PagoBalance } from '../entidades/pago-balance.entity.js';

export interface IPagoBalanceRepository {
  obtenerPorId(id: string): Promise<PagoBalance | null>;
  obtenerPorViaje(viajeId: string): Promise<PagoBalance | null>;
  obtenerPorConductor(conductorId: string): Promise<PagoBalance[]>;
  guardar(pago: PagoBalance): Promise<PagoBalance>;
}

export const PAGO_BALANCE_REPOSITORY = Symbol('IPagoBalanceRepository');
