import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { AtencionHistorial } from '../AtencionHistorial';
import type { CitaMedica, Paciente, EmpleadoEmp2024, CasoClinico } from '@/lib/types/domain';
import { Badge } from '@/components/ui/badge';
import { Database, User, Calendar, MapPin, Briefcase, Mail, Phone, Info } from 'lucide-react';

interface Step1Props {
    citaData: {
        cita: CitaMedica;
        paciente: Paciente;
        empleado: EmpleadoEmp2024;
        caso: CasoClinico;
    };
}

export function Step1_Resumen({ citaData }: Step1Props) {
    const { cita, paciente, empleado, caso } = citaData;
    const datosPsico = (caso as any)?.datos_extra?.Psicosocial || (caso as any)?.datosExtra?.Psicosocial;

    // Mock history for preview
    const mockHistorial: any[] = [
        { fechaAtencion: new Date(Date.now() - 86400000 * 30).toISOString(), diagnosticoPrincipal: "Gripe común con fiebre persistente.", estadoClinico: 'BIEN' },
        { fechaAtencion: new Date(Date.now() - 86400000 * 60).toISOString(), diagnosticoPrincipal: "Control rutinario de presión arterial.", estadoClinico: 'BIEN' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Paciente Info Card */}
                <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50 border-b pb-4 flex flex-row items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-sm">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-slate-900">{paciente.nombre_completo || paciente.nombreCompleto}</CardTitle>
                            <CardDescription className="font-bold text-primary">Carnet: {paciente.carnet}</CardDescription>
                        </div>
                        <div className="ml-auto">
                           <SemaforoBadge nivel={cita.nivelSemaforoPaciente || 'V'} className="h-8 pr-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Info className="h-3.5 w-3.5" /> Datos Laborales
                            </h4>
                            <div className="space-y-3">
                                <p className="flex items-center gap-3 text-slate-600"><Briefcase className="h-4 w-4 text-slate-400" /> <strong>Cargo:</strong> {empleado.cargo}</p>
                                <p className="flex items-center gap-3 text-slate-600"><MapPin className="h-4 w-4 text-slate-400" /> <strong>Área:</strong> {empleado.area} ({empleado.gerencia})</p>
                                <p className="flex items-center gap-3 text-slate-600 font-bold"><Badge variant="outline" className="text-primary border-primary/20">Estado: {empleado.estado}</Badge></p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5" /> Contacto
                            </h4>
                            <div className="space-y-3">
                                <p className="flex items-center gap-3 text-slate-600"><Mail className="h-4 w-4 text-slate-400" /> {empleado.correo}</p>
                                <p className="flex items-center gap-3 text-slate-600"><Phone className="h-4 w-4 text-slate-400" /> {empleado.telefono}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cita Detail Card */}
                <Card className="border-none shadow-sm bg-primary text-white">
                    <CardHeader className="border-b border-white/10 pb-4">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Detalles de Cita
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                            <p className="text-xs text-white/60 font-bold uppercase mb-1">Motivo Principal</p>
                            <p className="text-sm font-medium leading-relaxed italic">
                                "{cita.motivoResumen || 'Sin especificar'}"
                            </p>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2">
                            <span className="opacity-70">Fecha:</span>
                            <span className="font-bold">{new Date(cita.fechaCita!).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
                            <span className="opacity-70">Hora Programada:</span>
                            <span className="font-bold text-2xl">{cita.horaCita}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* History Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                   <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-lg">
                            <Database className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Historial de Consultas Caso #{caso.id_caso}</h3>
                            <p className="text-sm text-slate-500">Últimos registros de atención médica para este paciente.</p>
                        </div>
                   </div>
                   <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">CASO ACTIVO</Badge>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <AtencionHistorial atenciones={mockHistorial} />
                </div>
            </div>
        </div>
    );
}
