import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { 
  Activity, 
  Calendar, 
  Syringe, 
  FileText, 
  History, 
  TrendingUp, 
  AlertCircle,
  Stethoscope,
  Heart,
  Droplets,
  ArrowUpRight
} from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { cn } from '@/lib/utils';

export function PacienteDashboard() {
    const { userProfile } = useUserProfile();

    // Simulación de datos del colaborador
    const stats = [
        { label: "Chequeos Mes", value: "4", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Última Cita", value: "12 Mar", icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Vacunas", value: "3", icon: Syringe, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Exámenes", value: "2", icon: FileText, color: "text-rose-600", bg: "bg-rose-50" },
    ];

    const medicalEvents = [
        { type: 'atencion', title: 'Control General Médico', date: '2024-03-12', detail: 'Faringitis resuelta. Recomendación de hidratación.', id: 1 },
        { type: 'vacuna', title: 'Vacuna Influenza - Campaña 2024', date: '2024-02-15', detail: 'Dosis única anual aplicada.', id: 2 },
        { type: 'examen', title: 'Examen de Laboratorio', date: '2024-01-20', detail: 'Hemograma completo - Valores normales.', id: 3 },
    ];

    return (
        <div className="p-1 space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header / Salud General */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Mi Perfil de Salud</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Stethoscope className="h-3 w-3" /> Registro integral para {userProfile?.nombre_completo || 'Colaborador'}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-right">
                        <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Mi Semáforo</Label>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase leading-tight mt-1">Estable</p>
                    </div>
                    <SemaforoBadge nivel="V" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <Card key={s.label} className="border-none shadow-sm overflow-hidden bg-white/60 backdrop-blur-md group hover:shadow-lg transition-all duration-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", s.bg)}>
                                    <s.icon className={cn("h-5 w-5", s.color)} />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-black italic text-slate-900 tracking-tighter leading-none">{s.value}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Timeline / Historial */}
                <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white pb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <History className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-white font-black italic uppercase tracking-tight">Mi Historial Reciente</CardTitle>
                                <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Actividad Médica Cronológica</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {medicalEvents.map((ev) => (
                                <div key={ev.id} className="p-6 hover:bg-slate-50 transition-colors flex gap-6 group">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12",
                                            ev.type === 'atencion' ? "bg-emerald-100 text-emerald-600" : ev.type === 'vacuna' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                                        )}>
                                            {ev.type === 'atencion' ? <Stethoscope className="h-5 w-5" /> : ev.type === 'vacuna' ? <Syringe className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                        </div>
                                        <div className="h-full w-[2px] bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-black italic text-slate-900 uppercase tracking-tight text-sm">{ev.title}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {ev.date}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{ev.detail}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-widest">Ver Detalles</Badge>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-widest">Reporte PDF</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Status Column */}
                <div className="space-y-6">
                    {/* Tarjeta Vitales */}
                    <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500 to-rose-600 text-white overflow-hidden relative">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white font-black italic uppercase tracking-tight flex items-center gap-2">
                                <Heart className="h-5 w-5" /> Mis Vitales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <p className="text-[9px] font-black uppercase text-rose-200 tracking-widest mb-1">Presión</p>
                                    <h5 className="font-black italic text-xl">120/80</h5>
                                </div>
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <p className="text-[9px] font-black uppercase text-rose-200 tracking-widest mb-1">Ritmo</p>
                                    <h5 className="font-black italic text-xl">72 BPM</h5>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 opacity-10">
                                <Activity className="h-32 w-32" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alertas */}
                    <Card className="border-none shadow-sm bg-amber-50 border-l-4 border-amber-500 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="bg-amber-100 p-2 rounded-lg h-fit">
                                    <AlertCircle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-black italic text-sm text-amber-900 uppercase">Campaña Activa</h5>
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">Se encuentra disponible la campaña de vacunación para Refuerzo COVID. Acude al consultorio de 10:00 a 14:00.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Próximo Chequeo */}
                    <Card className="border-none shadow-sm bg-indigo-50 border-l-4 border-indigo-500 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-black italic text-sm text-indigo-900 uppercase">Siguiente Cita</h5>
                                    <p className="text-xs text-indigo-700 font-black uppercase mt-1">25 de Marzo - 11:00 AM</p>
                                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Médico: Dra. Ana López</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>{children}</label>;
}
