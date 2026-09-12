import '../../domain/entities/perfil_conductor.dart';
import 'perfil_state_status.dart';

class PerfilState {
  final PerfilStateStatus status;
  final PerfilConductor? perfil;
  final String? errorMessage;
  final bool guardadoOk;

  const PerfilState({
    required this.status,
    this.perfil,
    this.errorMessage,
    this.guardadoOk = false,
  });

  PerfilState copyWith({
    PerfilStateStatus? status,
    PerfilConductor? perfil,
    String? errorMessage,
    bool? guardadoOk,
  }) {
    return PerfilState(
      status: status ?? this.status,
      perfil: perfil ?? this.perfil,
      errorMessage: errorMessage,
      guardadoOk: guardadoOk ?? false,
    );
  }
}
