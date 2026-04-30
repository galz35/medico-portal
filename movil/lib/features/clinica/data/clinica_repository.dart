import 'package:dio/dio.dart';
import '../../../core/network/api_client.dart';
import '../domain/cita.dart';

class ClinicaRepository {
  final Dio _dio = ApiClient.dio;

  Future<List<Cita>> getCitas() async {
    try {
      final response = await _dio.get('medico/citas');
      final List<dynamic> data = response.data;
      return data.map((json) => Cita.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> registrarAtencion(int idCita, Map<String, dynamic> datos) async {
    try {
      await _dio.post('medico/atencion', data: {
        'idCita': idCita,
        ...datos,
      });
    } catch (e) {
      rethrow;
    }
  }
}
