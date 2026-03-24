import { 
    Users, 
    Stethoscope, 
    Activity, 
    ArrowUpRight, 
    TrendingUp, 
    AlertCircle, 
    CalendarCheck, 
    Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AdminDashboard() {
  const stats = [
    { label: 'Médicos Activos', value: '24', icon: Stethoscope, color: 'text-indigo-600 bg-indigo-50', trend: '+2 nuevos este mes' },
    { label: 'Pacientes Totales', value: '1,280', icon: Users, color: 'text-emerald-600 bg-emerald-50', trend: '+15% vs mes anterior' },
    { label: 'Citas Hoy', value: '48', icon: CalendarCheck, color: 'text-amber-600 bg-amber-50', trend: '85% ocupación' },
    { label: 'Alertas Sanitarias', value: '3', icon: AlertCircle, color: 'text-rose-600 bg-rose-50', trend: 'Requiere revisión' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Admin<span className="text-primary NOT-italic font-black">Center</span></h1>
          <p className="mt-2 text-slate-500 font-bold uppercase text-xs tracking-widest">Panel de Control de Gestión Clínica • Clínica Central</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 bg-white">
                <Database className="h-4 w-4" /> Exportar Datos
            </Button>
            <Button className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 bg-primary shadow-lg shadow-primary/20">
                <Activity className="h-4 w-4" /> Generar Reporte
            </Button>
        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl group overflow-hidden bg-white">
             <CardContent className="p-6 relative">
                <div className="flex justify-between items-start">
                    <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:rotate-12", stat.color)}>
                        <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter flex items-center gap-1 opacity-60 border-slate-100">
                        INFO <ArrowUpRight className="h-3 w-3" />
                    </Badge>
                </div>
                <div className="mt-6">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{stat.value}</p>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500">{stat.trend}</span>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Ocupación Hospítalaria</CardTitle>
                <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Activity className="h-3 w-3" /> Tiempo real • Actualizado hace 2 min
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-8 min-h-[300px] flex items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mt-4">
                <div className="text-center group cursor-pointer">
                    <div className="h-20 w-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/10 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">Cargando Gráficos de Análisis...</p>
                </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white p-8 group">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-white text-2xl font-black tracking-tighter uppercase italic">SSO Audit</CardTitle>
                <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Seguridad y Cumplimiento</CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-6 space-y-6">
                {[
                    { label: 'Token Validation', status: 'ACTIVE', color: 'bg-emerald-500' },
                    { label: 'VPN Encryption', status: 'STABLE', color: 'bg-emerald-500' },
                    { label: 'Cloud Database', status: 'SYNCING', color: 'bg-indigo-500' }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{item.label}</span>
                        <div className="flex items-center gap-2">
                            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", item.color)} />
                            <span className="text-[10px] font-black tracking-widest opacity-80">{item.status}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
            <Button variant="ghost" className="w-full mt-4 text-primary font-black uppercase text-[10px] tracking-[0.5em] hover:bg-white/5 group-hover:translate-x-1 transition-transform">
                Monitor System <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
         </Card>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
