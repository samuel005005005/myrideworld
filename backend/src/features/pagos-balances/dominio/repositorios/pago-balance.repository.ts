import { PagoBalance } from '../entidades/pago-balance.entity.js';

export interface FiltrosPagoBalance {
  conductorId?: string;
  desde?: Date;
  hasta?: Date;
}

export interface ResumenLiquidacion {
  totalBruto: number;
  totalFee: number;
  totalNeto: number;
  cantidad: number;
}

export interface IPagoBalanceRepository {
  obtenerPorId(id: string): Promise<PagoBalance | null>;
  obtenerPorViaje(viajeId: string): Promise<PagoBalance | null>;
  obtenerPorConductor(conductorId: string): Promise<PagoBalance[]>;
  listar(filtros?: FiltrosPagoBalance): Promise<PagoBalance[]>;
  resumenLiquidacion(filtros?: FiltrosPagoBalance): Promise<ResumenLiquidacion>;
  guardar(pago: PagoBalance): Promise<PagoBalance>;
}

export const PAGO_BALANCE_REPOSITORY = Symbol('IPagoBalanceRepository');
