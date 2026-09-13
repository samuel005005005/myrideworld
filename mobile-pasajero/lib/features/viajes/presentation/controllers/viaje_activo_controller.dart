import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/logging/resultado_logging.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
import '../../domain/usecases/cancelar_viaje_params.dart';
import '../../domain/usecases/obtener_viaje_por_id_params.dart';
import '../providers/viajes_provider.dart';
import 'viaje_activo_state.dart';

final viajeActivoControllerProvider =
    NotifierProvider<ViajeActivoController, ViajeActivoState>(
      ViajeActivoController.new,
    );

class ViajeActivoController extends Notifier<ViajeActivoState> {
  bool _seguimientoIniciado = false;

  @override
  ViajeActivoState build() {
    ref.onDispose(detenerSeguimiento);

    return const ViajeActivoState(
      ubicacionConductor: LatLng(18.5820, -68.3971),
      estadoViaje: AppStrings.trackingEsperandoConfirmacion,
    );
  }

  ViajeRealtimeGateway get _gateway => ref.read(viajeRealtimeGatewayProvider);

  Future<void> iniciarSeguimiento(String? viajeId) async {
    if (_seguimientoIniciado) {
      return;
    }

    _seguimientoIniciado = true;

    if (viajeId != null && viajeId.isNotEmpty) {
      state = state.copyWith(viajeId: viajeId);
    }

    final gateway = _gateway;
    await gateway.conectar();

    if (viajeId != null && viajeId.isNotEmpty) {
      gateway.unirseAViaje(viajeId);
      await _cargarDetalleViaje(viajeId);
    }

    gateway.escucharUbicacionActualizada((lat, lng) {
      state = state.copyWith(ubicacionConductor: LatLng(lat, lng));
    });

    gateway.escucharViajeAceptado((conductor) {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingConductorEnCamino,
        infoEta: AppStrings.trackingLlegandoEnCincoMinutos,
        conductor: conductor,
      );
    });

    gateway.escucharConductorLlego(() {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingConductorHaLlegado,
        infoEta: null,
      );
    });

    gateway.escucharViajeIniciado(() {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingViajeEnCursoDestino,
        infoEta: null,
      );
    });

    gateway.escucharViajeCompletado((recibo) {
      state = state.copyWith(reciboPendiente: recibo);
    });
  }

  Future<bool> cancelarViajeActivo() async {
    final id = state.viajeId;
    if (id == null || id.isEmpty || state.cancelando) {
      return false;
    }

    state = state.copyWith(cancelando: true, errorCancelacion: null);
    final resultado = await ref.read(cancelarViajeUseCaseProvider)(
      CancelarViajeParams(viajeId: id),
    );

    return resultado.foldLogged(
      'ViajeActivoController.cancelarViajeActivo',
      (failure) {
        state = state.copyWith(
          cancelando: false,
          errorCancelacion: failure.mensaje,
        );
        return false;
      },
      (_) {
        state = state.copyWith(
          cancelando: false,
          cancelado: true,
          estadoViaje: AppStrings.trackingViajeCancelado,
          infoEta: null,
        );
        detenerSeguimiento();
        return true;
      },
    );
  }

  Future<void> _cargarDetalleViaje(String viajeId) async {
    final resultado = await ref.read(obtenerViajePorIdUseCaseProvider)(
      ObtenerViajePorIdParams(viajeId),
    );
    resultado.fold((_) {}, (viaje) {
      final conductor = viaje.conductor;
      if (conductor != null) {
        state = state.copyWith(
          viajeId: viajeId,
          conductor: conductor,
          estadoViaje: AppStrings.trackingConductorEnCamino,
        );
      } else {
        state = state.copyWith(viajeId: viajeId);
      }
    });
  }

  void consumirReciboPendiente() {
    state = state.copyWith(reciboPendiente: null);
  }

  void detenerSeguimiento() {
    if (!_seguimientoIniciado) {
      return;
    }

    _seguimientoIniciado = false;
    _gateway.desconectar();
  }
}
