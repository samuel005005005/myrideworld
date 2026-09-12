import '../entities/metodo_pago.dart';
import '../entities/tipo_vehiculo.dart';

/// Calcula tarifas estimadas MVP por tipo de vehículo y método de pago.
class CalculadoraTarifa {
  static const double comisionTarjeta = 0.075;

  double calcularBase(TipoVehiculo vehiculo, double distanciaKm) {
    if (distanciaKm <= 0) {
      return switch (vehiculo) {
        TipoVehiculo.minivan => 55,
        TipoVehiculo.suv => 65,
        TipoVehiculo.sedan => 35,
      };
    }

    return switch (vehiculo) {
      TipoVehiculo.minivan => 15 + (distanciaKm * 2.5),
      TipoVehiculo.suv => 25 + (distanciaKm * 3.0),
      TipoVehiculo.sedan => 10 + (distanciaKm * 1.5),
    };
  }

  double calcularTotal({
    required TipoVehiculo vehiculo,
    required MetodoPago metodoPago,
    required double distanciaKm,
  }) {
    final base = calcularBase(vehiculo, distanciaKm);
    if (metodoPago == MetodoPago.tarjeta) {
      return base * (1 + comisionTarjeta);
    }
    return base;
  }
}
