import { Injectable } from '@nestjs/common';

/** Registro en memoria de oferta activa por viaje (para cancelar timbre). */
@Injectable()
export class OfertasViajeActivasRegistry {
  private readonly porViaje = new Map<string, string>();

  registrar(viajeId: string, conductorId: string): void {
    this.porViaje.set(viajeId, conductorId);
  }

  conductorDe(viajeId: string): string | undefined {
    return this.porViaje.get(viajeId);
  }

  /** Viaje cuya oferta activa está asignada a este conductor (si hay). */
  viajeIdDeConductor(conductorId: string): string | undefined {
    for (const [viajeId, asignado] of this.porViaje.entries()) {
      if (asignado === conductorId) {
        return viajeId;
      }
    }
    return undefined;
  }

  /** Todos los viajes ofertados actualmente a este conductor. */
  viajesIdsDeConductor(conductorId: string): string[] {
    const ids: string[] = [];
    for (const [viajeId, asignado] of this.porViaje.entries()) {
      if (asignado === conductorId) {
        ids.push(viajeId);
      }
    }
    return ids;
  }

  liberar(viajeId: string): string | undefined {
    const conductorId = this.porViaje.get(viajeId);
    this.porViaje.delete(viajeId);
    return conductorId;
  }

  tieneOfertaActivaPara(conductorId: string): boolean {
    return this.viajeIdDeConductor(conductorId) !== undefined;
  }
}
