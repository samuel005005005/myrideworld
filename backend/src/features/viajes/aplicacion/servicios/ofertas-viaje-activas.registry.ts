import { Injectable } from '@nestjs/common';

/** Ofertas activas: un viaje puede sonar en varios conductores a la vez. */
@Injectable()
export class OfertasViajeActivasRegistry {
  private readonly porViaje = new Map<string, Set<string>>();
  /** Índice inverso O(1) para listar viajes de un conductor. */
  private readonly porConductor = new Map<string, Set<string>>();

  registrar(viajeId: string, conductorId: string): void {
    let setViaje = this.porViaje.get(viajeId);
    if (!setViaje) {
      setViaje = new Set<string>();
      this.porViaje.set(viajeId, setViaje);
    }
    setViaje.add(conductorId);

    let setConductor = this.porConductor.get(conductorId);
    if (!setConductor) {
      setConductor = new Set<string>();
      this.porConductor.set(conductorId, setConductor);
    }
    setConductor.add(viajeId);
  }

  /** @deprecated Preferí conductoresDe — queda el primero para compat. */
  conductorDe(viajeId: string): string | undefined {
    const set = this.porViaje.get(viajeId);
    if (!set || set.size === 0) {
      return undefined;
    }
    return set.values().next().value;
  }

  conductoresDe(viajeId: string): string[] {
    const set = this.porViaje.get(viajeId);
    return set ? [...set] : [];
  }

  tieneOferta(viajeId: string, conductorId: string): boolean {
    return this.porViaje.get(viajeId)?.has(conductorId) ?? false;
  }

  viajeIdDeConductor(conductorId: string): string | undefined {
    const set = this.porConductor.get(conductorId);
    if (!set || set.size === 0) {
      return undefined;
    }
    return set.values().next().value;
  }

  viajesIdsDeConductor(conductorId: string): string[] {
    const set = this.porConductor.get(conductorId);
    return set ? [...set] : [];
  }

  liberarConductor(viajeId: string, conductorId: string): boolean {
    const setViaje = this.porViaje.get(viajeId);
    if (!setViaje) {
      return false;
    }
    const habia = setViaje.delete(conductorId);
    if (setViaje.size === 0) {
      this.porViaje.delete(viajeId);
    }

    const setConductor = this.porConductor.get(conductorId);
    if (setConductor) {
      setConductor.delete(viajeId);
      if (setConductor.size === 0) {
        this.porConductor.delete(conductorId);
      }
    }
    return habia;
  }

  liberarTodos(viajeId: string): string[] {
    const set = this.porViaje.get(viajeId);
    this.porViaje.delete(viajeId);
    const conductores = set ? [...set] : [];
    for (const conductorId of conductores) {
      const setConductor = this.porConductor.get(conductorId);
      if (!setConductor) {
        continue;
      }
      setConductor.delete(viajeId);
      if (setConductor.size === 0) {
        this.porConductor.delete(conductorId);
      }
    }
    return conductores;
  }

  liberar(viajeId: string): string | undefined {
    const todos = this.liberarTodos(viajeId);
    return todos[0];
  }

  tieneOfertaActivaPara(conductorId: string): boolean {
    return this.viajeIdDeConductor(conductorId) !== undefined;
  }
}
