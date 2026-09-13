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

  liberar(viajeId: string): string | undefined {
    const conductorId = this.porViaje.get(viajeId);
    this.porViaje.delete(viajeId);
    return conductorId;
  }
}
