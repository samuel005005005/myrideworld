import 'package:latlong2/latlong.dart';

class UbicacionesTuristicas {
  static const String aeropuertoPuntaCana =
      'Aeropuerto Internacional de Punta Cana (PUJ)';
  static const String hardRockHotel = 'Hard Rock Hotel & Casino Punta Cana';
  static const String cocoBongo = 'Coco Bongo Punta Cana';
  static const String bavaroBeachResort = 'Bavaro Beach Resort';
  static const String capCanaMarina = 'Cap Cana Marina';
  static const String uveroAltoPlaza = 'Uvero Alto Plaza';
  static const String blueMallPuntacana = 'BlueMall Puntacana';
  static const String downtownPuntaCana = 'Downtown Punta Cana';

  static const List<String> resultadosBusqueda = <String>[
    aeropuertoPuntaCana,
    hardRockHotel,
    cocoBongo,
    bavaroBeachResort,
    capCanaMarina,
    uveroAltoPlaza,
    blueMallPuntacana,
    downtownPuntaCana,
  ];

  static const Map<String, LatLng> coordenadasPorNombre = <String, LatLng>{
    aeropuertoPuntaCana: LatLng(18.5674, -68.3634),
    hardRockHotel: LatLng(18.7302, -68.5284),
    cocoBongo: LatLng(18.6300, -68.4200),
    bavaroBeachResort: LatLng(18.6811, -68.4287),
    capCanaMarina: LatLng(18.4984, -68.3846),
    uveroAltoPlaza: LatLng(18.8143, -68.6186),
    blueMallPuntacana: LatLng(18.5583, -68.3756),
    downtownPuntaCana: LatLng(18.6182, -68.3976),
  };
}
