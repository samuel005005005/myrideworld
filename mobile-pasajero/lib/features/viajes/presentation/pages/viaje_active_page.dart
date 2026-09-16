import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/constants/app_strings.dart';
import '../controllers/viaje_activo_controller.dart';
import '../controllers/viaje_activo_state.dart';
import '../widgets/marcador_mapa_viaje.dart';
import '../widgets/capa_marcador_posicion_suave.dart';

class ViajeActivePage extends ConsumerStatefulWidget {
  final String? viajeId;
  const ViajeActivePage({super.key, this.viajeId});

  @override
  ConsumerState<ViajeActivePage> createState() => _ViajeActivePageState();
}

class _ViajeActivePageState extends ConsumerState<ViajeActivePage> {
  final MapController _mapController = MapController();
  late final ViajeActivoController _viajeActivoController =
      ref.read(viajeActivoControllerProvider.notifier);
  String? _ultimaClaveCamara;
  bool _mapaListo = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) {
        return;
      }
      unawaited(_viajeActivoController.iniciarSeguimiento(widget.viajeId));
    });
  }

  @override
  void dispose() {
    Future<void>(() => _viajeActivoController.detenerSeguimiento());
    super.dispose();
  }

  void _ajustarCamara(ViajeActivoState estado) {
    if (!_mapaListo) {
      return;
    }

    final puntos = <LatLng>[
      if (estado.ubicacionConductor != null) estado.ubicacionConductor!,
      if (estado.origen != null && !estado.haciaDestino) estado.origen!,
      if (estado.destino != null) estado.destino!,
      ...estado.puntosRuta,
    ];
    if (puntos.isEmpty) {
      return;
    }
    final clave =
        '${estado.viajeId}|${estado.haciaDestino}|${estado.puntosRuta.length}|'
        // Cámara solo ante cambios gruesos (~100 m), no en cada fix GPS.
        '${estado.ubicacionConductor?.latitude.toStringAsFixed(3)}|'
        '${estado.origen?.latitude.toStringAsFixed(3)}';
    if (_ultimaClaveCamara == clave) {
      return;
    }
    _ultimaClaveCamara = clave;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_mapaListo) {
        return;
      }
      try {
        if (puntos.length == 1) {
          _mapController.move(puntos.first, 15);
          return;
        }
        _mapController.fitCamera(
          CameraFit.bounds(
            bounds: LatLngBounds.fromPoints(puntos),
            padding: const EdgeInsets.fromLTRB(48, 120, 48, 280),
          ),
        );
      } catch (_) {
        // Mapa aún no listo o sin tamaño: se reintenta en el próximo update.
        _ultimaClaveCamara = null;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(viajeActivoControllerProvider);

    ref.listen<ViajeActivoState>(viajeActivoControllerProvider, (
      anterior,
      siguiente,
    ) {
      if (anterior?.ubicacionConductor != siguiente.ubicacionConductor ||
          anterior?.puntosRuta != siguiente.puntosRuta ||
          anterior?.haciaDestino != siguiente.haciaDestino ||
          anterior?.origen != siguiente.origen ||
          anterior?.destino != siguiente.destino) {
        _ajustarCamara(siguiente);
      }

      final reciboPendiente = siguiente.reciboPendiente;
      if (reciboPendiente != null &&
          anterior?.reciboPendiente != reciboPendiente &&
          context.mounted) {
        ref
            .read(viajeActivoControllerProvider.notifier)
            .consumirReciboPendiente();
        context.go('/recibo', extra: reciboPendiente);
      }
    });

    const brandPrimary = Color(0xFFF59E0B);
    const textDark = Color(0xFF1E293B);
    const textGrey = Color(0xFF64748B);
    const borderGrey = Color(0xFFE2E8F0);
    const dangerColor = Color(0xFFDC2626);
    final centroInicial =
        estado.ubicacionConductor ??
        estado.origen ??
        const LatLng(18.5820, -68.3971);

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: centroInicial,
                initialZoom: 14.0,
                onMapReady: () {
                  _mapaListo = true;
                  _ajustarCamara(estado);
                },
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.myride.mobile_pasajero',
                ),
                if (estado.puntosRuta.isNotEmpty)
                  PolylineLayer(
                    polylines: [
                      Polyline(
                        points: estado.puntosRuta,
                        strokeWidth: 5,
                        color: brandPrimary,
                      ),
                    ],
                  ),
                MarkerLayer(
                  markers: [
                    if (estado.origen != null && !estado.haciaDestino)
                      Marker(
                        point: estado.origen!,
                        width: 148,
                        height: 98,
                        alignment: Alignment.bottomCenter,
                        child: MarcadorMapaViaje(
                          color: const Color(0xFF2563EB),
                          icono: Icons.person_rounded,
                          etiqueta: AppStrings.formatoMarcadorConLugar(
                            AppStrings.trackingMarcadorRecogida,
                            estado.direccionRecogida,
                          ),
                          conPunta: true,
                          onTap: () => _mostrarDetalleMarcador(
                            titulo: AppStrings.trackingDetalleRecogida,
                            color: const Color(0xFF2563EB),
                            icono: Icons.person_rounded,
                            lugar: estado.direccionRecogida,
                            punto: estado.origen!,
                          ),
                          onLongPress: () => _copiarInfoMarcador(
                            punto: estado.origen!,
                          ),
                        ),
                      ),
                    if (estado.destino != null)
                      Marker(
                        point: estado.destino!,
                        width: 148,
                        height: 98,
                        alignment: Alignment.bottomCenter,
                        child: MarcadorMapaViaje(
                          color: const Color(0xFFDC2626),
                          icono: Icons.place_rounded,
                          etiqueta: AppStrings.formatoMarcadorConLugar(
                            AppStrings.trackingMarcadorDestino,
                            estado.direccionDestino,
                          ),
                          conPunta: true,
                          onTap: () => _mostrarDetalleMarcador(
                            titulo: AppStrings.trackingDetalleDestino,
                            color: const Color(0xFFDC2626),
                            icono: Icons.place_rounded,
                            lugar: estado.direccionDestino,
                            punto: estado.destino!,
                          ),
                          onLongPress: () => _copiarInfoMarcador(
                            punto: estado.destino!,
                          ),
                        ),
                      ),
                  ],
                ),
                CapaMarcadorPosicionSuave(
                  destino: estado.ubicacionConductor,
                  width: 148,
                  height: 88,
                  builder: (context, puntoVisible) {
                    return MarcadorMapaViaje(
                      color: brandPrimary,
                      icono: Icons.directions_car_filled_rounded,
                      etiqueta: AppStrings.formatoMarcadorConLugar(
                        AppStrings.trackingMarcadorConductor,
                        estado.direccionConductor,
                      ),
                      onTap: () => _mostrarDetalleMarcador(
                        titulo: AppStrings.trackingDetalleConductor,
                        color: brandPrimary,
                        icono: Icons.directions_car_filled_rounded,
                        lugar: estado.direccionConductor,
                        punto: estado.ubicacionConductor ?? puntoVisible,
                      ),
                      onLongPress: () => _copiarInfoMarcador(
                        punto: estado.ubicacionConductor ?? puntoVisible,
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            child: CircleAvatar(
              backgroundColor: Colors.white,
              radius: 24,
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: textDark),
                onPressed: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/home');
                  }
                },
              ),
            ),
          ),

          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            right: 16,
            child: Material(
              color: dangerColor,
              elevation: 4,
              borderRadius: BorderRadius.circular(24),
              child: InkWell(
                onTap: () => context.push('/ayuda'),
                borderRadius: BorderRadius.circular(24),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.shield, color: Colors.white, size: 18),
                      SizedBox(width: 6),
                      Text(
                        AppStrings.trackingSOS,
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          DraggableScrollableSheet(
            initialChildSize: 0.45,
            minChildSize: 0.15,
            maxChildSize: 0.75,
            builder: (context, scrollController) {
              return Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 20,
                      offset: Offset(0, -5),
                    ),
                  ],
                ),
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: EdgeInsets.only(
                    left: 20,
                    right: 20,
                    top: 16,
                    bottom: MediaQuery.of(context).padding.bottom + 20,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        estado.estadoViaje,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: textDark,
                        ),
                      ),
                      if (estado.infoEta != null) ...[
                        const SizedBox(height: 6),
                        Text(
                          estado.infoEta!,
                          style: const TextStyle(
                            fontSize: 14,
                            color: textGrey,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                      const SizedBox(height: 16),
                      const Divider(color: borderGrey),
                      const SizedBox(height: 16),

                      // Driver Info
                      Row(
                        children: [
                          _AvatarConductor(
                            nombre: estado.conductor?.nombreCompleto,
                            fotoUrl: estado.conductor?.fotoUrl,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  estado.conductor?.nombreCompleto ??
                                      AppStrings.trackingConductorPendiente,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: textDark,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  estado.conductor?.vehiculoResumen.isNotEmpty ==
                                          true
                                      ? estado.conductor!.vehiculoResumen
                                      : AppStrings.trackingVehiculoPendiente,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: textGrey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.grey.shade100,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.grey.shade300),
                              ),
                              child: Text(
                                (estado.conductor?.vehiculoPlaca.isNotEmpty ==
                                        true)
                                    ? estado.conductor!.vehiculoPlaca
                                    : AppStrings.trackingPlacaPendiente,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 1.0,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 20),

                      // Acciones reales (llamar conductor si hay teléfono)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _buildActionBtn(
                            icon: Icons.call,
                            label: AppStrings.trackingCallAction,
                            onTap: () => _llamarConductor(
                              context,
                              estado.conductor?.telefono,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      if (estado.puedeCancelar)
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton(
                            onPressed: estado.cancelando
                                ? null
                                : () async {
                                    final ok = await ref
                                        .read(
                                          viajeActivoControllerProvider
                                              .notifier,
                                        )
                                        .cancelarViajeActivo();
                                    if (ok && context.mounted) {
                                      context.go('/home');
                                    }
                                  },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: dangerColor,
                              side: const BorderSide(color: dangerColor),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: Text(
                              estado.cancelando
                                  ? AppStrings.trackingCancelando
                                  : AppStrings.trackingCancelarViaje,
                            ),
                          ),
                        ),

                      if (estado.errorCancelacion != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          estado.errorCancelacion!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13,
                            color: dangerColor,
                          ),
                        ),
                      ],

                      const SizedBox(height: 16),

                      const Text(
                        AppStrings.trackingWaitingCompletion,
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 13, color: textGrey),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Future<void> _copiarInfoMarcador({required LatLng punto}) async {
    final texto = AppStrings.formatoCoordenada(
      punto.latitude,
      punto.longitude,
    );
    await Clipboard.setData(ClipboardData(text: texto));
    if (!mounted) {
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(AppStrings.trackingMarcadorCopiado),
        duration: Duration(seconds: 2),
      ),
    );
  }

  Future<void> _mostrarDetalleMarcador({
    required String titulo,
    required Color color,
    required IconData icono,
    required String? lugar,
    required LatLng punto,
  }) {
    final textoLugar = (lugar == null || lugar.trim().isEmpty)
        ? AppStrings.trackingDireccionCargando
        : lugar;
    final coords = AppStrings.formatoCoordenada(
      punto.latitude,
      punto.longitude,
    );

    return showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icono, color: color, size: 26),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            titulo,
                            style: const TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF1E293B),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            textoLugar,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF64748B),
                              height: 1.3,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            coords,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF1E293B),
                              fontFamily: 'monospace',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () async {
                      Navigator.of(context).pop();
                      await _copiarInfoMarcador(punto: punto);
                    },
                    icon: const Icon(Icons.copy_rounded, size: 18),
                    label: const Text(AppStrings.trackingMarcadorCopiarCoords),
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text(AppStrings.trackingMarcadorCerrar),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildActionBtn({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          children: [
            CircleAvatar(
              radius: 24,
              backgroundColor: Colors.grey.shade100,
              child: Icon(icon, color: const Color(0xFF1E293B)),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _llamarConductor(BuildContext context, String? telefono) async {
    final numero = telefono?.trim() ?? '';
    if (numero.isEmpty) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.trackingTelefonoNoDisponible)),
      );
      return;
    }

    final uri = Uri(scheme: 'tel', path: numero);
    final ok = await launchUrl(uri);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text(AppStrings.trackingLlamadaFallida)),
      );
    }
  }
}

class _AvatarConductor extends StatelessWidget {
  final String? nombre;
  final String? fotoUrl;

  const _AvatarConductor({this.nombre, this.fotoUrl});

  @override
  Widget build(BuildContext context) {
    final urlHttp =
        fotoUrl != null &&
        (fotoUrl!.startsWith('http://') || fotoUrl!.startsWith('https://'));

    if (urlHttp) {
      return CircleAvatar(
        radius: 28,
        backgroundColor: Colors.grey.shade200,
        backgroundImage: NetworkImage(fotoUrl!),
      );
    }

    final inicial = (nombre != null && nombre!.isNotEmpty)
        ? nombre![0].toUpperCase()
        : '?';

    return CircleAvatar(
      radius: 28,
      backgroundColor: const Color(0xFFF59E0B).withValues(alpha: 0.2),
      child: Text(
        inicial,
        style: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Color(0xFF1E293B),
        ),
      ),
    );
  }
}
