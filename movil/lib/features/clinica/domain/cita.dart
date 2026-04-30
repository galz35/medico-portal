class Cita {
  final int id;
  final String fecha;
  final String hora;
  final String paciente;
  final String carnet;
  final String motivo;
  final String estado;

  Cita({
    required this.id,
    required this.fecha,
    required this.hora,
    required this.paciente,
    required this.carnet,
    required this.motivo,
    required this.estado,
  });

  factory Cita.fromJson(Map<String, dynamic> json) {
    return Cita(
      id: json['id_cita'] ?? json['id'] ?? 0,
      fecha: json['fecha'] ?? '',
      hora: json['hora'] ?? '',
      paciente: json['nombre_completo'] ?? json['paciente'] ?? 'Desconocido',
      carnet: json['carnet'] ?? '',
      motivo: json['motivo'] ?? '',
      estado: json['estado'] ?? 'PENDIENTE',
    );
  }
}
