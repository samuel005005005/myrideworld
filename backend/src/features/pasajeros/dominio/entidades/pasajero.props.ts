import { EstadosPasajero } from '../../../../compartidos/constantes/estados-pasajero.enum.js';

export interface PasajeroProps {
  id?: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  passwordHash: string;
  fechaRegistro?: Date;
  estado?: EstadosPasajero;
}
