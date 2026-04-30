import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../home/presentation/home_shell.dart';
import '../data/clinica_repository.dart';
import '../domain/cita.dart';

class ClinicaHomeScreen extends StatefulWidget {
  const ClinicaHomeScreen({super.key});

  @override
  State<ClinicaHomeScreen> createState() => _ClinicaHomeScreenState();
}

class _ClinicaHomeScreenState extends State<ClinicaHomeScreen> {
  final _repository = ClinicaRepository();
  List<Cita>? _citas;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final citas = await _repository.getCitas();
      setState(() {
        _citas = citas;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'No se pudieron cargar las citas';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: const MomentusAppBar(title: 'Mi Agenda Médica'),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.red),
            const SizedBox(height: 16),
            Text(_error!, style: const TextStyle(fontSize: 16)),
            TextButton(onPressed: _loadData, child: const Text('Reintentar')),
          ],
        ),
      );
    }

    if (_citas == null || _citas!.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.calendar_today, size: 64, color: Colors.blue),
            SizedBox(height: 16),
            Text('No hay citas programadas para hoy', style: TextStyle(color: Colors.grey, fontSize: 16)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _citas!.length,
      itemBuilder: (context, index) {
        final cita = _citas![index];
        return _buildCitaCard(cita);
      },
    );
  }

  Widget _buildCitaCard(Cita cita) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: IntrinsicHeight(
          child: Row(
            children: [
              Container(
                width: 6,
                color: _getStatusColor(cita.estado),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            cita.hora,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.blue),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getStatusColor(cita.estado).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              cita.estado,
                              style: TextStyle(
                                color: _getStatusColor(cita.estado),
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        cita.paciente,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1E293B)),
                      ),
                      Text(
                        'Carnet: ${cita.carnet}',
                        style: const TextStyle(color: Color(0xFF64748B), fontSize: 14),
                      ),
                      const Divider(height: 24),
                      Row(
                        children: [
                          const Icon(Icons.info_outline, size: 16, color: Color(0xFF94A3B8)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              cita.motivo,
                              style: const TextStyle(color: Color(0xFF475569), fontSize: 14),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            // TODO: Abrir pantalla de atención
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                            elevation: 0,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          child: const Text('Atender Paciente'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String estado) {
    switch (estado.toUpperCase()) {
      case 'COMPLETADA':
        return Colors.green;
      case 'PENDIENTE':
        return Colors.blue;
      case 'CANCELADA':
        return Colors.red;
      default:
        return Colors.orange;
    }
  }
}
