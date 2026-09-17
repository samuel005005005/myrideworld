import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { Conductor } from '../../../conductores/dominio/entidades/conductor.entity.js';
import { Pasajero } from '../../../pasajeros/dominio/entidades/pasajero.entity.js';

export class ViajeConConductor {
  constructor(
    readonly viaje: Viaje,
    readonly conductor: Conductor | null,
    readonly pasajero: Pasajero | null = null,
  ) {}
}
