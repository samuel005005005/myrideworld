import { Viaje } from '../../dominio/entidades/viaje.entity.js';
import { Conductor } from '../../../conductores/dominio/entidades/conductor.entity.js';

export class ViajeConConductor {
  constructor(
    readonly viaje: Viaje,
    readonly conductor: Conductor | null,
  ) {}
}
