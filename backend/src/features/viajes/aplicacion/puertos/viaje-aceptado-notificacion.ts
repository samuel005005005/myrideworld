import { ConductorResumenPublicoDto } from '../../../conductores/aplicacion/dto/conductor-resumen-publico.dto.js';

export class ViajeAceptadoNotificacion {
  viajeId: string;
  conductorId: string;
  conductor: ConductorResumenPublicoDto | null;
}
