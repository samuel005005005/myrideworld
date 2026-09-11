import { EstadosConductor, EstadosDisponibilidadConductor } from '../../../../compartidos/constantes/estados-conductor.enum.js';

export interface ConductorProps {
  id?: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  passwordHash: string;
  fotoUrl?: string;
  vehiculoMarca: string;
  vehiculoModelo: string;
  vehiculoColor: string;
  vehiculoPlaca: string;
  estadoAprobacion?: EstadosConductor;
  estadoDisponibilidad?: EstadosDisponibilidadConductor;
  ultimaUbicacionLat?: number | null;
  ultimaUbicacionLng?: number;
}
