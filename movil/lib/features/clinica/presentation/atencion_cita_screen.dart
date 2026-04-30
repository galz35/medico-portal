import 'package:flutter/material.dart';

import '../../auth/domain/session_user.dart';
import '../data/clinica_repository.dart';
import '../domain/cita.dart';

class AtencionCitaScreen extends StatefulWidget {
  const AtencionCitaScreen({
    super.key,
    required this.cita,
    required this.user,
  });

  final Cita cita;
  final SessionUser user;

  @override
  State<AtencionCitaScreen> createState() => _AtencionCitaScreenState();
}

class _AtencionCitaScreenState extends State<AtencionCitaScreen> {
  final _repository = ClinicaRepository();
  final _formKey = GlobalKey<FormState>();
  final _diagnosticoController = TextEditingController();
  final _tratamientoController = TextEditingController();
  final _recomendacionesController = TextEditingController();
  bool _requiereSeguimiento = false;
  bool _loading = false;

  @override
  void dispose() {
    _diagnosticoController.dispose();
    _tratamientoController.dispose();
    _recomendacionesController.dispose();
    super.dispose();
  }

  Future<void> _guardar() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _loading = true);
    try {
      await _repository.registrarAtencion(widget.cita.id, {
        'idMedico': widget.user.idMedico ?? widget.user.id,
        'diagnosticoPrincipal': _diagnosticoController.text.trim(),
        'planTratamiento': _tratamientoController.text.trim(),
        'recomendaciones': _recomendacionesController.text.trim(),
        'requiereSeguimiento': _requiereSeguimiento,
      });

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Atención registrada')),
      );
      Navigator.pop(context, true);
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No se pudo registrar la atención')),
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Atender paciente')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              widget.cita.paciente,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 4),
            Text('Carnet: ${widget.cita.carnet}'),
            const SizedBox(height: 20),
            TextFormField(
              controller: _diagnosticoController,
              decoration: const InputDecoration(
                labelText: 'Diagnóstico principal',
                border: OutlineInputBorder(),
              ),
              minLines: 2,
              maxLines: 4,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Ingresa el diagnóstico';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _tratamientoController,
              decoration: const InputDecoration(
                labelText: 'Plan de tratamiento',
                border: OutlineInputBorder(),
              ),
              minLines: 2,
              maxLines: 4,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _recomendacionesController,
              decoration: const InputDecoration(
                labelText: 'Recomendaciones',
                border: OutlineInputBorder(),
              ),
              minLines: 2,
              maxLines: 4,
            ),
            const SizedBox(height: 8),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Requiere seguimiento'),
              value: _requiereSeguimiento,
              onChanged: (value) => setState(() => _requiereSeguimiento = value),
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 52,
              child: ElevatedButton(
                onPressed: _loading ? null : _guardar,
                child: _loading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Guardar atención'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
