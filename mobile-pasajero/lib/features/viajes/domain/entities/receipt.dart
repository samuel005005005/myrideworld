class Receipt {
  final String tripId;
  final double baseFare;
  final double tipAmount;
  final double taxes;
  final double total;
  final String paymentStatus;

  const Receipt({
    required this.tripId,
    required this.baseFare,
    required this.tipAmount,
    required this.taxes,
    required this.total,
    required this.paymentStatus,
  });
}
