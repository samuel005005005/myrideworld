class PagoBalance {
  final String id;
  final String viajeId;
  final double montoBruto;
  final double feeProcesamiento;
  final double montoNeto;
  final String metodo;
  final DateTime fecha;

  const PagoBalance({
    required this.id,
    required this.viajeId,
    required this.montoBruto,
    required this.feeProcesamiento,
    required this.montoNeto,
    required this.metodo,
    required this.fecha,
  });
}
