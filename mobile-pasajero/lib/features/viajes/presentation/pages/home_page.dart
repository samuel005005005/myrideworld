import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';

import '../../../../core/constants/app_strings.dart';
import '../controllers/home_controller.dart';

const _vehiculoSedan = 'sedan';
const _vehiculoMinivan = 'minivan';
const _vehiculoSuv = 'suv';
const _pagoEfectivo = 'cash';
const _pagoTarjeta = 'card';

final selectedVehicleProvider = StateProvider<String>((ref) => _vehiculoSedan);
final selectedPaymentProvider = StateProvider<String>((ref) => _pagoEfectivo);

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

    final sedanPrice = _calcularTarifaBase(_vehiculoSedan, routeDistanceKm);
    final minivanPrice = _calcularTarifaBase(_vehiculoMinivan, routeDistanceKm);
    final suvPrice = _calcularTarifaBase(_vehiculoSuv, routeDistanceKm);
    final basePrice = switch (selectedVehicle) {
      _vehiculoMinivan => minivanPrice,
      _vehiculoSuv => suvPrice,
      _ => sedanPrice,
    };
    final finalPrice = selectedPayment == _pagoTarjeta
        ? basePrice * 1.075
        : basePrice;

    final ubicacionActual =
        estado.currentLocation ?? const LatLng(18.5820, -68.3971);
    final ubicacionDestino = estado.destinationLocation;

    return Scaffold(
      key: _scaffoldKey,
      drawer: _buildDrawer(context),
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.verified_user,
                        color: brandPrimary,
                        size: 14,
                      ),
                      const SizedBox(width: 4),
                      const Text(
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
                                _buildLocationTrigger(
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
                                _buildLocationTrigger(
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
                        _buildUberVehicleTile(
                          id: _vehiculoSedan,
                          name: AppStrings.homeVehicleSedan,
                          eta: etaSedan,
                          capacity: 4,
                          basePrice: sedanPrice,
                          icon: Icons.directions_car,
                          selectedId: selectedVehicle,
                          paymentMethod: selectedPayment,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  _vehiculoSedan,
                        ),
                        _buildUberVehicleTile(
                          id: _vehiculoMinivan,
                          name: AppStrings.homeVehicleMinivan,
                          eta: etaMinivan,
                          capacity: 6,
                          basePrice: minivanPrice,
                          icon: Icons.airport_shuttle,
                          selectedId: selectedVehicle,
                          paymentMethod: selectedPayment,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  _vehiculoMinivan,
                        ),
                        _buildUberVehicleTile(
                          id: _vehiculoSuv,
                          name: AppStrings.homeVehicleSuv,
                          eta: etaSuv,
                          capacity: 6,
                          basePrice: suvPrice,
                          icon: Icons.time_to_leave,
                          selectedId: selectedVehicle,
                          paymentMethod: selectedPayment,
                          brandPrimary: brandPrimary,
                          onTap: () =>
                              ref.read(selectedVehicleProvider.notifier).state =
                                  _vehiculoSuv,
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
                                  .state = selectedPayment == _pagoEfectivo
                              ? _pagoTarjeta
                              : _pagoEfectivo,
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
                                  selectedPayment == _pagoEfectivo
                                      ? Icons.money
                                      : Icons.credit_card,
                                  size: 20,
                                  color: textDark,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  selectedPayment == _pagoEfectivo
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
                                    AppStrings.homeSolicitarVehiculo(
                                      _etiquetaVehiculoParaBoton(
                                        selectedVehicle,
                                      ),
                                      finalPrice,
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

  double _calcularTarifaBase(String vehiculo, double distanciaKm) {
    if (distanciaKm <= 0) {
      return switch (vehiculo) {
        _vehiculoMinivan => 55,
        _vehiculoSuv => 65,
        _ => 35,
      };
    }

    return switch (vehiculo) {
      _vehiculoMinivan => 15 + (distanciaKm * 2.5),
      _vehiculoSuv => 25 + (distanciaKm * 3.0),
      _ => 10 + (distanciaKm * 1.5),
    };
  }

  String _etiquetaVehiculoParaBoton(String vehiculo) {
    return switch (vehiculo) {
      _vehiculoMinivan => AppStrings.homeVehicleMinivanLabel,
      _vehiculoSuv => AppStrings.homeVehicleSuvLabel,
      _ => AppStrings.homeVehicleSedanLabel,
    };
  }

  Widget _buildLocationTrigger({
    required String value,
    required VoidCallback onTap,
  }) {
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

  Widget _buildUberVehicleTile({
    required String id,
    required String name,
    required String eta,
    required int capacity,
    required double basePrice,
    required IconData icon,
    required String selectedId,
    required String paymentMethod,
    required Color brandPrimary,
    required VoidCallback onTap,
  }) {
    final selected = selectedId == id;
    final borderColor = selected ? brandPrimary : Colors.transparent;
    final bgColor = selected
        ? brandPrimary.withOpacity(0.08)
        : Colors.transparent;
    final finalPrice = paymentMethod == _pagoTarjeta
        ? basePrice * 1.075
        : basePrice;

    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: bgColor,
          border: Border.all(color: borderColor, width: 2),
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        child: Row(
          children: [
            Icon(icon, size: 40, color: Colors.black87),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.person, size: 14, color: Colors.black54),
                      Text(
                        capacity.toString(),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    eta,
                    style: const TextStyle(fontSize: 13, color: Colors.black54),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  AppStrings.homePrecioVehiculo(finalPrice),
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                if (paymentMethod == _pagoTarjeta)
                  const Text(
                    AppStrings.homeCardFeeIncluded,
                    style: TextStyle(fontSize: 10, color: Colors.black54),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    const textDark = Color(0xFF1E293B);
    const brandPrimary = Color(0xFFF59E0B);

    return Drawer(
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            InkWell(
              onTap: () {
                context.pop();
                context.push('/perfil');
              },
              child: Container(
                padding: const EdgeInsets.only(
                  left: 24,
                  right: 24,
                  top: 40,
                  bottom: 24,
                ),
                child: Row(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: brandPrimary, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: brandPrimary.withOpacity(0.2),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const CircleAvatar(
                        radius: 32,
                        backgroundColor: Colors.white,
                        backgroundImage: NetworkImage(
                          'https://randomuser.me/api/portraits/men/44.jpg',
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            AppStrings.homeDrawerPassengerName,
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: textDark,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: brandPrimary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.star,
                                  color: brandPrimary,
                                  size: 14,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  AppStrings.homeDrawerPassengerCategory,
                                  style: TextStyle(
                                    color: brandPrimary.withOpacity(0.9),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            _buildDrawerItem(
              icon: Icons.history,
              title: AppStrings.homeDrawerTrips,
              onTap: () {
                context.pop();
                context.push('/history');
              },
            ),
            _buildDrawerItem(
              icon: Icons.credit_card,
              title: AppStrings.homeDrawerPaymentMethods,
              onTap: () {
                context.pop();
                context.push('/pagos');
              },
            ),
            _buildDrawerItem(
              icon: Icons.local_offer_outlined,
              title: AppStrings.homeDrawerPromotions,
              onTap: () => context.pop(),
            ),
            _buildDrawerItem(
              icon: Icons.support_agent,
              title: AppStrings.homeDrawerSupport,
              onTap: () {
                context.pop();
                context.push('/ayuda');
              },
            ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.all(32),
              child: TextButton.icon(
                onPressed: () => context.go('/welcome'),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.red.shade500,
                  alignment: Alignment.centerLeft,
                  padding: EdgeInsets.zero,
                ),
                icon: const Icon(Icons.logout, size: 22),
                label: const Text(
                  AppStrings.homeDrawerLogout,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 32, vertical: 4),
      leading: Icon(icon, color: const Color(0xFF1E293B), size: 26),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: Color(0xFF1E293B),
        ),
      ),
      onTap: onTap,
    );
  }
}
