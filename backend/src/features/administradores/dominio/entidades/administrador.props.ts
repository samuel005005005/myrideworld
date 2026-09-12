import { RolesAdmin } from '../../../../compartidos/constantes/roles-admin.enum.js';

export interface AdministradorProps {
  id?: string;
  nombreCompleto: string;
  email: string;
  passwordHash: string;
  rolAdmin: RolesAdmin;
  activo?: boolean;
  fechaRegistro?: Date;
}
