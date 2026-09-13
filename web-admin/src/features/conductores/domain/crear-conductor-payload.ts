export interface CrearConductorPayload {
  nombreCompleto: string;
  email: string;
  telefono: string;
  vehiculoMarca: string;
  vehiculoModelo: string;
  vehiculoColor: string;
  vehiculoPlaca: string;
  password: string;
  aprobarAlCrear?: boolean;
}
