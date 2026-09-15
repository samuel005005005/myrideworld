import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Id del último viaje cancelado por socket (pasajero / sistema).
final viajeCanceladoIdProvider =
    NotifierProvider<ViajeCanceladoIdNotifier, String?>(
  ViajeCanceladoIdNotifier.new,
);

class ViajeCanceladoIdNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void notificar(String viajeId) {
    state = viajeId;
  }
}
