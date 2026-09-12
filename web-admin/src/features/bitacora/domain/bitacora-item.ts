export interface BitacoraItem {
  id: string;
  tipoEvento: string;
  servicioSistema: string;
  detalle: string;
  usuario: string;
  fecha: string;
  accion: string;
  entidadId: string | null;
  ip: string | null;
  duracionMs: number | null;
}
