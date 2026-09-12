import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../../domain/entities/metodo_pago.dart';
import '../../domain/entities/tipo_vehiculo.dart';
import '../controllers/home_controller.dart';
import '../controllers/home_state.dart';
import '../controllers/home_state_status.dart';
import '../widgets/home_drawer.dart';
import '../widgets/home_vehicle_tile.dart';

final selectedVehicleProvider = StateProvider<TipoVehiculo>(
  (ref) => TipoVehiculo.sedan,
);
final selectedPaymentProvider = StateProvider<MetodoPago>(
  (ref) => MetodoPago.efectivo,
);

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(homeControllerProvider.notifier).inicializar();
    });
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(homeControllerProvider);
    final selectedVehicle = ref.watch(selectedVehicleProvider);
    final selectedPayment = ref.watch(selectedPaymentProvider);
    final isRequesting = estado.status == HomeStateStatus.loading;

    ref.listen<HomeState>(homeControllerProvider, (anterior, siguiente) {
      if (siguiente.routePoints.isNotEmpty &&
          anterior?.routePoints != siguiente.routePoints) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (!mounted) {
            return;
          }

          final bounds = LatLngBounds.fromPoints(siguiente.routePoints);
          _mapController.fitCamera(
            CameraFit.bounds(
              bounds: bounds,
              padding: const EdgeInsets.only(
                top: 100,
                bottom: 400,
                left: 50,
                right: 50,
              ),
            ),
          );
        });
      }

      final errorMessage = siguiente.errorMessage;
      if (errorMessage != null &&
          errorMessage != anterior?.errorMessage &&
          mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(errorMessage)));
      }

      final viaje = siguiente.activeTrip;
      if (viaje != null &&
          viaje.id != anterior?.activeTrip?.id &&
          siguiente.status == HomeStateStatus.tripRequested &&
          mounted) {
        context.go('/viaje-active', extra: viaje);
      }
    });

    const brandPrimary = Color(0xFFF59E0B);
    const textDark = Color(0xFF1E293B);
    const bgGrey = Color(0xFFEEEEEE);
    const dividerColor = Color(0xFFE2E2E2);

    final routeDistanceKm = estado.routeDistanceKm;
    final routeDurationMin = estado.routeDurationMin;
    final routePoints = estado.routePoints;
    final etaSedan = _formatEta(routeDurationMin);
    final etaMinivan = _formatEta(routeDurationMin + 2);
    final etaSuv = _formatEta(routeDurationMin + 5);

    final ubicacionActual =
        estado.currentLocation ?? const LatLng(18.5820, -68.3971);
    final ubicacionDestino = estado.destinationLocation;

    return Scaffold(
      key: _scaffoldKey,
      drawer: const HomeDrawer(),
      body: Stack(
        children: [
          Positioned.fill(
            child: FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: ubicacionActual,
                initialZoom: 12.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.example.myride',
                ),
                if (routePoints.isNotEmpty)
                  PolylineLayer(
                    polylines: [
                      Polyline(
                        points: routePoints,
                        strokeWidth: 4.0,
                        color: brandPrimary,
                      ),
                    ],
                  ),
                MarkerLayer(
                  markers: [
                    if (routePoints.isNotEmpty)
                      Marker(
                        point: routePoints.first,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.green,
                          size: 36,
                        ),
                      )
                    else if (estado.currentLocation != null)
                      Marker(
                        point: estado.currentLocation!,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.green,
                          size: 36,
                        ),
                      ),
                    if (routePoints.isNotEmpty)
                      Marker(
                        point: routePoints.last,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 36,
                        ),
                      )
                    else if (ubicacionDestino != null)
                      Marker(
                        point: ubicacionDestino,
                        child: const Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 36,
                        ),
                      ),
                  ],
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
                icon: const Icon(Icons.menu, color: textDark),
                onPressed: () => _scaffoldKey.currentState?.openDrawer(),
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(20),
                  topRight: Radius.circular(20),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 10,
                    offset: Offset(0, -2),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Center(
                    child: Container(
                      margin: const EdgeInsets.only(top: 8, bottom: 8),
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.verified_user, color: brandPrimary, size: 14),
                      SizedBox(width: 4),
                      Text(
                        AppStrings.homeOfficialRatesMitur,
                        style: TextStyle(
                          fontSize: 12,
                          color: brandPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: dividerColor),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          Column(
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: Colors.grey,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              Container(
                                width: 1,
                                height: 28,
                                color: Colors.grey,
                                margin: const EdgeInsets.symmetric(vertical: 4),
                              ),
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: Colors.black,
                                  shape: BoxShape.rectangle,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              children: [
                                _LocationTrigger(
                                  value: estado.pickupLabel,
                                  onTap: () async {
                                    final result = await context.push<String>(
                                      '/search-location',
                                      extra: {
                                        'pickup': estado.pickupLabel,
                                        'dropoff': estado.dropoffLabel,
                                        'focusDropoff': false,
                                      },
                                    );
                                    if (result != null) {
                                      await ref
                                          .read(homeControllerProvider.notifier)
                                          .seleccionarOrigen(result);
                                    }
                                  },
                                ),
                                const SizedBox(height: 8),
                                _LocationTrigger(
                                  value: estado.dropoffLabel,
                                  onTap: () async {
                                    final result = await context.push<String>(
                                      '/search-location',
                                      extra: {
                                        'pickup': estado.pickupLabel,
                                        'dropoff': estado.dropoffLabel,
                                        'focusDropoff': true,
                                      },
                                    );
                                    if (result != null) {
                                      await ref
                                          .read(homeControllerProvider.notifier)
                                          .seleccionarDestino(result);
                                    }
                                  },
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (routeDistanceKm > 0)
                    Padding(
                      padding: const EdgeInsets.only(top: 8, bottom: 4),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.info_outline,
                            size: 16,
                            color: Colors.black54,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            AppStrings.homeResumenRuta(
                              routeDistanceKm,
                              routeDurationMin,
                            ),
                            style: const TextStyle(
                              fontSize: 13,
                              color: Colors.black54,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 12),
                  const Divider(height: 1, color: dividerColor),
                  Container(
                    padding: const EdgeInsets.all(16),
                    margin: const EdgeInsets.symmetric(
                      vertical: 8,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: dividerColor),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          AppStrings.homeResumenDistancia(routeDistanceKm),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textDark,
                          ),
                        ),
                        Text(
                          AppStrings.homeResumenEta(routeDurationMin),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: textDark,
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 200,
                    child: ListView(
                      padding: EdgeInsets.zero,
                      children: [
                        HomeVehicleTile(
                          id: TipoVehiculo.sedan.name,
                          name: AppStrings.homeVehicleSedan,
                          eta: etaSedan,
                          capacity: 4,
                          icon: Icons.directions_car,
                          selectedId: selectedVehicle.name,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  TipoVehiculo.sedan,
                        ),
                        HomeVehicleTile(
                          id: TipoVehiculo.minivan.name,
                          name: AppStrings.homeVehicleMinivan,
                          eta: etaMinivan,
                          capacity: 6,
                          icon: Icons.airport_shuttle,
                          selectedId: selectedVehicle.name,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  TipoVehiculo.minivan,
                        ),
                        HomeVehicleTile(
                          id: TipoVehiculo.suv.name,
                          name: AppStrings.homeVehicleSuv,
                          eta: etaSuv,
                          capacity: 6,
                          icon: Icons.time_to_leave,
                          selectedId: selectedVehicle.name,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  TipoVehiculo.suv,
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, color: dividerColor),
                  Padding(
                    padding: EdgeInsets.only(
                      left: 16,
                      right: 16,
                      top: 12,
                      bottom: MediaQuery.of(context).padding.bottom + 12,
                    ),
                    child: Row(
                      children: [
                        InkWell(
                          onTap: () =>
                              ref
                                  .read(selectedPaymentProvider.notifier)
                                  .state = selectedPayment == MetodoPago.efectivo
                              ? MetodoPago.tarjeta
                              : MetodoPago.efectivo,
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 12,
                            ),
                            decoration: BoxDecoration(
                              color: bgGrey,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  selectedPayment == MetodoPago.efectivo
                                      ? Icons.money
                                      : Icons.credit_card,
                                  size: 20,
                                  color: textDark,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  selectedPayment == MetodoPago.efectivo
                                      ? AppStrings.homePaymentCashShort
                                      : AppStrings.homePaymentCardShort,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Icon(Icons.keyboard_arrow_up, size: 16),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: isRequesting
                                ? null
                                : () async {
                                    await ref
                                        .read(homeControllerProvider.notifier)
                                        .requestTrip();
                                  },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: brandPrimary,
                              foregroundColor: Colors.black87,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                              elevation: 0,
                            ),
                            child: isRequesting
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(
                                      color: Colors.black87,
                                      strokeWidth: 2,
                                    ),
                                  )
                                : Text(
                                    AppStrings.homeSolicitarVehiculoSinPrecio(
                                      _etiquetaVehiculo(selectedVehicle),
                                    ),
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatEta(int extraMinutes) {
    if (extraMinutes <= 0) {
      return AppStrings.homeEtaNoDisponible;
    }

    final now = DateTime.now().add(Duration(minutes: extraMinutes));
    final hour = now.hour > 12
        ? now.hour - 12
        : (now.hour == 0 ? 12 : now.hour);
    final minute = now.minute.toString().padLeft(2, '0');
    final ampm = now.hour >= 12 ? 'PM' : 'AM';
    return '$hour:$minute $ampm';
  }

  String _etiquetaVehiculo(TipoVehiculo vehiculo) {
    return switch (vehiculo) {
      TipoVehiculo.minivan => AppStrings.homeVehicleMinivanLabel,
      TipoVehiculo.suv => AppStrings.homeVehicleSuvLabel,
      TipoVehiculo.sedan => AppStrings.homeVehicleSedanLabel,
    };
  }
}

class _LocationTrigger extends StatelessWidget {
  final String value;
  final VoidCallback onTap;

  const _LocationTrigger({required this.value, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(6),
      child: Container(
        height: 40,
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(6),
        ),
        alignment: Alignment.centerLeft,
        child: Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            fontSize: 14,
            color: Colors.black87,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
    );
  }
}
