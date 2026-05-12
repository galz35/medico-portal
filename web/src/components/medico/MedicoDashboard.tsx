import { Calendar, Clock, Users, AlertTriangle, ArrowUpRight, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MedicoDashboard() {
  const stats = [
    { label: 'Citas Hoy', value: '12', icon: Calendar, color: 'text-blue-600 bg-blue-50', trend: '3 pendientes' },
    { label: 'Pacientes Atendidos', value: '48', icon: Users, color: 'text-emerald-600 bg-emerald-50', trend: '+8 esta semana' },
    { label: 'Casos Abiertos', value: '5', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', trend: '2 requieren seguimiento' },
    { label: 'Próxima Cita', value: '10:30', icon: Clock, color: 'text-purple-600 bg-purple-50', trend: 'En 45 min' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Dashboard <span className="text-primary not-italic font-black">Médico</span>
          </h1>
          <p className="mt-2 text-slate-500 font-bold uppercase text-xs tracking-widest">
            Resumen de Actividad Clínica
          </p>
        </div>
        <Button className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 bg-primary shadow-lg shadow-primary/20">
          <Activity className="h-4 w-4" /> Ver Agenda
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-lg shadow-slate-200/50 overflow-hidden group hover:shadow-xl transition-all">
            <div className="h-1.5 bg-gradient-to-r from-primary/80 to-primary" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { paciente: 'Carlos Ruiz', hora: '09:00', tipo: 'Control General', semaforo: 'V' },
                { paciente: 'Elena Sosa', hora: '10:30', tipo: 'Consulta', semaforo: 'A' },
                { paciente: 'Luis Mejía', hora: '11:45', tipo: 'Seguimiento', semaforo: 'R' },
              ].map((cita) => (
                <div key={cita.hora} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-14 text-center">
                    <p className="text-sm font-bold text-slate-900">{cita.hora}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{cita.paciente}</p>
                    <p className="text-sm text-slate-500">{cita.tipo}</p>
                  </div>
                  <Badge className={
                    cita.semaforo === 'V' ? 'bg-emerald-100 text-emerald-700' :
                    cita.semaforo === 'A' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }>
                    {cita.semaforo === 'V' ? 'Verde' : cita.semaforo === 'A' ? 'Amarillo' : 'Rojo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Alertas de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { paciente: 'María López', alerta: 'Presión arterial elevada', prioridad: 'Alta' },
                { paciente: 'Pedro García', alerta: 'Control de glucosa pendiente', prioridad: 'Media' },
              ].map((alerta) => (
                <div key={alerta.paciente} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${alerta.prioridad === 'Alta' ? 'text-rose-500' : 'text-amber-500'}`} />
                  <div>
                    <p className="font-semibold text-slate-900">{alerta.paciente}</p>
                    <p className="text-sm text-slate-500">{alerta.alerta}</p>
                  </div>
                  <Badge className={alerta.prioridad === 'Alta' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}>
                    {alerta.prioridad}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
