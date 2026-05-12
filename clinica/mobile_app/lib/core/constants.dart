// App móvil oficial del Portal Clínica
// Compilar con: flutter build apk --dart-define=API_BASE_URL=https://rhclaroni.com/api-portal-clinica/api
class AppConstants {
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://rhclaroni.com/api-portal-clinica/api',
  );

  static const String appName = 'Claro Mi Salud';
  static const String appVersion = '1.0.0';
}
