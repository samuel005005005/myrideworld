import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/services/socket_service.dart';
import '../../data/mappers/recibo_viaje_mapper.dart';
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

  Future<void> iniciarSeguimiento(String? viajeId) async {
    if (_seguimientoIniciado) {
      return;
    }

    _seguimientoIniciado = true;

    final socketService = ref.read(socketServiceProvider);
    await socketService.conectar();

    if (viajeId != null && viajeId.isNotEmpty) {
      socketService.unirseAViaje(viajeId);
    }

    socketService.escucharUbicacionActualizada((payload) {
      final lat = payload['lat'] as num?;
      final lng = payload['lng'] as num?;

      if (lat == null || lng == null) {
        return;
      }

      state = state.copyWith(
        ubicacionConductor: LatLng(lat.toDouble(), lng.toDouble()),
      );
    });

    socketService.escucharViajeAceptado(() {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingConductorEnCamino,
        infoEta: AppStrings.trackingLlegandoEnCincoMinutos,
      );
    });

    socketService.escucharConductorLlego(() {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingConductorHaLlegado,
        infoEta: null,
      );
    });

    socketService.escucharViajeIniciado(() {
      state = state.copyWith(
        estadoViaje: AppStrings.trackingViajeEnCursoDestino,
        infoEta: null,
      );
    });

    socketService.escucharViajeCompletado((payload) {
      final data = payload is Map<String, dynamic>
          ? payload
          : Map<String, dynamic>.from(payload as Map);

      state = state.copyWith(
        reciboPendiente: ReciboViajeMapper.fromEventoCompletado(data),
      );
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
    ref.read(socketServiceProvider).desconectar();
  }
}
