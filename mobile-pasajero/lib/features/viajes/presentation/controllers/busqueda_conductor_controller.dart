import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/logging/resultado_logging.dart';
import '../../domain/entities/conductor_asignado.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../../domain/usecases/cancelar_viaje_params.dart';
import '../../domain/usecases/obtener_viaje_por_id_params.dart';
import '../providers/viajes_provider.dart';
import 'busqueda_conductor_state.dart';

final busquedaConductorControllerProvider =
    NotifierProvider.autoDispose<
      BusquedaConductorController,
      BusquedaConductorState
    >(BusquedaConductorController.new);

class BusquedaConductorController extends Notifier<BusquedaConductorState> {
  bool _iniciado = false;
  String? _viajeId;

  @override
  BusquedaConductorState build() {
    ref.onDispose(() => _detener());
    return const BusquedaConductorState();
  }

  ViajeRealtimeGateway get _gateway => ref.read(viajeRealtimeGatewayProvider);

  Future<void> iniciar(String viajeId) async {
    if (_iniciado) {
      return;
    }
    _iniciado = true;
    _viajeId = viajeId;

    final gateway = _gateway;
    await gateway.conectar();
    gateway.dejarDeObservarFlota();

    gateway.escucharViajeAceptado((ConductorAsignado? conductor) {
      state = state.copyWith(
        conductorAsignado: conductor,
        listoParaNavegar: true,
      );
    });

    gateway.unirseAViaje(viajeId);

    final detalle = await ref.read(obtenerViajePorIdUseCaseProvider)(
      ObtenerViajePorIdParams(viajeId),
    );
    detalle.fold((_) {}, (viaje) {
      if (viaje.conductor != null) {
        state = state.copyWith(
          conductorAsignado: viaje.conductor,
          listoParaNavegar: true,
        );
      }
    });
  }

  Future<bool> cancelarSolicitud() async {
    final viajeId = _viajeId;
    if (viajeId == null) {
      return true;
    }

    state = state.copyWith(cancelando: true, error: null);
    final resultado = await ref.read(cancelarViajeUseCaseProvider)(
      CancelarViajeParams(viajeId: viajeId),
    );

    return resultado.foldLogged(
      'BusquedaConductorController.cancelarSolicitud',
      (failure) {
        // Ya cancelado (timeout/reintento) o no cancelable: salir de búsqueda.
        final salirIgual = failure.mensaje.contains(
          'no puede ser cancelado en su estado actual',
        );
        if (salirIgual) {
          _detener(desconectarSocket: true);
          state = state.copyWith(cancelando: false, error: null);
          return true;
        }
        state = state.copyWith(cancelando: false, error: failure.mensaje);
        return false;
      },
      (_) {
        _detener(desconectarSocket: true);
        state = state.copyWith(cancelando: false);
        return true;
      },
    );
  }

  void _detener({bool desconectarSocket = false}) {
    _iniciado = false;
    if (desconectarSocket) {
      _gateway.desconectar();
    }
  }
}
