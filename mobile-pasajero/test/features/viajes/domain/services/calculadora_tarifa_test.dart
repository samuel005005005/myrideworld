import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_pasajero/features/viajes/domain/entities/metodo_pago.dart';
import 'package:mobile_pasajero/features/viajes/domain/entities/tipo_vehiculo.dart';
import 'package:mobile_pasajero/features/viajes/domain/services/calculadora_tarifa.dart';

void main() {
  late CalculadoraTarifa calculadora;

  setUp(() {
    calculadora = CalculadoraTarifa();
  });

  group('CalculadoraTarifa', () {
    test('deberia calcular tarifa base fija cuando distancia es cero', () {
      expect(calculadora.calcularBase(TipoVehiculo.sedan, 0), 35);
      expect(calculadora.calcularBase(TipoVehiculo.minivan, 0), 55);
      expect(calculadora.calcularBase(TipoVehiculo.suv, 0), 65);
    });

    test('deberia calcular tarifa por km para sedan', () {
      expect(calculadora.calcularBase(TipoVehiculo.sedan, 10), 25);
    });

    test('deberia aplicar comision de tarjeta al total', () {
      final total = calculadora.calcularTotal(
        vehiculo: TipoVehiculo.sedan,
        metodoPago: MetodoPago.tarjeta,
        distanciaKm: 10,
      );

      expect(total, closeTo(25 * 1.075, 0.001));
    });

    test('no deberia aplicar comision con efectivo', () {
      final total = calculadora.calcularTotal(
        vehiculo: TipoVehiculo.sedan,
        metodoPago: MetodoPago.efectivo,
        distanciaKm: 10,
      );

      expect(total, 25);
    });
  });
}
