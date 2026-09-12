import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/repositories/viaje_realtime_gateway.dart';
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

    final gateway = _gateway;
    await gateway.conectar();

    if (viajeId != null && viajeId.isNotEmpty) {
      gateway.unirseAViaje(viajeId);
    }

    gateway.escucharUbicacionActualizada((lat, lng) {
      state = state.copyWith(ubicacionConductor: LatLng(lat, lng));
    });

    gateway.escucharViajeAceptado(() {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingConductorEnCamino,
        infoEta: AppStrings.trackingLlegandoEnCincoMinutos,
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
