import 'package:latlong2/latlong.dart';

/// Lugares de búsqueda / OD. La tarifa plana Cap Cana la decide el API
/// por geocerca (ambos puntos dentro), no por este catálogo.
class UbicacionesTuristicas {
  static const String aeropuertoPuntaCana =
      'Aeropuerto Internacional de Punta Cana (PUJ)';
  static const String hardRockHotel = 'Hard Rock Hotel & Casino Punta Cana';
  static const String cocoBongo = 'Coco Bongo Punta Cana';
  static const String bavaroBeachResort = 'Bavaro Beach Resort';
  static const String uveroAltoPlaza = 'Uvero Alto Plaza';
  static const String blueMallPuntacana = 'BlueMall Puntacana';
  static const String downtownPuntaCana = 'Downtown Punta Cana';

  // Cap Cana (coords dentro del bbox seed GEOCERCA_CAP_CANA)
  static const String capCanaMarina = 'Cap Cana Marina';
  static const String juanilloBeach = 'Juanillo Beach Cap Cana';
  static const String puntaEspadaGolf = 'Punta Espada Golf Club';
  static const String edenRocCapCana = 'Eden Roc Cap Cana';
  static const String sanctuaryCapCana = 'Sanctuary Cap Cana';
  static const String secretsCapCana = 'Secrets Cap Cana Resort & Spa';
  static const String hyattZilaraCapCana = 'Hyatt Zilara Cap Cana';
  static const String hyattZivaCapCana = 'Hyatt Ziva Cap Cana';
  static const String stRegisCapCana = 'The St. Regis Cap Cana Resort';
  static const String dreamsCapCana = 'Dreams Cap Cana Resort & Spa';
  static const String fishingLodgeCapCana = 'Fishing Lodge Cap Cana';
  static const String casaDonLuisCapCana = 'Hotel Casa Don Luis Cap Cana';
  static const String caletonBeachClub = 'Caletón Beach Club Cap Cana';

  static const List<String> resultadosBusqueda = <String>[
    aeropuertoPuntaCana,
    hardRockHotel,
    cocoBongo,
    bavaroBeachResort,
    uveroAltoPlaza,
    blueMallPuntacana,
    downtownPuntaCana,
    capCanaMarina,
    juanilloBeach,
    puntaEspadaGolf,
    edenRocCapCana,
    sanctuaryCapCana,
    secretsCapCana,
    hyattZilaraCapCana,
    hyattZivaCapCana,
    stRegisCapCana,
    dreamsCapCana,
    fishingLodgeCapCana,
    casaDonLuisCapCana,
    caletonBeachClub,
  ];

  static const Map<String, LatLng> coordenadasPorNombre = <String, LatLng>{
    aeropuertoPuntaCana: LatLng(18.5674, -68.3634),
    hardRockHotel: LatLng(18.7302, -68.5284),
    cocoBongo: LatLng(18.6300, -68.4200),
    bavaroBeachResort: LatLng(18.6811, -68.4287),
    uveroAltoPlaza: LatLng(18.8143, -68.6186),
    blueMallPuntacana: LatLng(18.5583, -68.3756),
    downtownPuntaCana: LatLng(18.6182, -68.3976),
    capCanaMarina: LatLng(18.4984, -68.3846),
    juanilloBeach: LatLng(18.4685, -68.4020),
    puntaEspadaGolf: LatLng(18.4850, -68.3950),
    edenRocCapCana: LatLng(18.4920, -68.3780),
    sanctuaryCapCana: LatLng(18.5050, -68.3720),
    secretsCapCana: LatLng(18.5120, -68.3680),
    hyattZilaraCapCana: LatLng(18.5080, -68.3550),
    hyattZivaCapCana: LatLng(18.5105, -68.3565),
    stRegisCapCana: LatLng(18.5010, -68.3700),
    dreamsCapCana: LatLng(18.5150, -68.3520),
    fishingLodgeCapCana: LatLng(18.4960, -68.3820),
    casaDonLuisCapCana: LatLng(18.4990, -68.3835),
    caletonBeachClub: LatLng(18.4780, -68.4050),
  };
}
