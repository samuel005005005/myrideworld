import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Contador que incrementa cuando la sesión deja de ser válida (401 / JWT).
final sesionInvalidaTickProvider =
    NotifierProvider<SesionInvalidaTickNotifier, int>(
  SesionInvalidaTickNotifier.new,
);

class SesionInvalidaTickNotifier extends Notifier<int> {
  @override
  int build() => 0;

  void notificar() {
    state = state + 1;
  }
}
