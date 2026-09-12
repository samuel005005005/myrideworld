class TripHistory {
  final String id;
  final DateTime date;
  final double price;
  final String status;
  final String pickupLocation;
  final String dropoffLocation;
  final String driverName;
  final bool isCompleted;

  const TripHistory({
    required this.id,
    required this.date,
    required this.price,
    required this.status,
    required this.pickupLocation,
    required this.dropoffLocation,
    required this.driverName,
    required this.isCompleted,
  });
}
