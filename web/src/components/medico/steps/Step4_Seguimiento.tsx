import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AtencionMedica, SeguimientoGenerado } from "@/lib/types/domain";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, BellRing, Info, Zap, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step4Props {
    atencion: AtencionMedica;
    handleChange: (field: keyof AtencionMedica, value: any) => void;
    setSeguimientos: React.Dispatch<React.SetStateAction<SeguimientoGenerado[]>>;
    idPaciente: number;
}

export function Step4_Seguimiento({ atencion, handleChange, setSeguimientos, idPaciente }: Step4Props) {
    
    useEffect(() => {
        // Automatically suggest follow-up if clinical state is not 'BIEN'
        if (atencion.estadoClinico === 'REGULAR' || atencion.estadoClinico === 'MAL') {
            handleChange('requiereSeguimiento', true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [atencion.estadoClinico]);

    const quickDates = [
        { label: "En 3 días", days: 3 },
        { label: "En 1 semana", days: 7 },
        { label: "En 15 días", days: 15 },
        { label: "En 1 mes", days: 30 }
    ];

    const setQuickDate = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        const dateStr = date.toISOString().split('T')[0];
        handleChange('fechaSiguienteCita', dateStr);
    };

    const generarSeguimientoAutomatico = () => {
        if (!atencion.requiereSeguimiento || !atencion.fechaSiguienteCita) return;
        
        const nuevoSeguimiento: SeguimientoGenerado = {
            idCaso: atencion.idCaso,
            idAtencion: (atencion.idAtencion || 0).toString(),
            fechaProgramada: atencion.fechaSiguienteCita,
            motivo: `Seguimiento por: ${atencion.diagnosticoPrincipal || 'Revisión'}`,
            estadoClinicoAlProgramar: atencion.estadoClinico,
        };
        setSeguimientos(prev => [...prev, nuevoSeguimiento]);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 p-2 rounded-lg text-white shadow-lg">
                                <CalendarClock className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-slate-900 font-black tracking-tight text-lg italic uppercase leading-none">Control y Seguimiento</CardTitle>
                                <CardDescription className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Programación de Citas Futuras</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200">
                            <Switch
                                id="requiere-seguimiento"
                                checked={atencion.requiereSeguimiento}
                                onCheckedChange={(checked) => handleChange('requiereSeguimiento', checked)}
                            />
                            <Label htmlFor="requiere-seguimiento" className="text-xs font-black uppercase text-slate-600">Activar Seguimiento</Label>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {!atencion.requiereSeguimiento ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-4 opacity-50">
                            <BellRing className="h-10 w-10" />
                            <p className="text-sm font-bold uppercase tracking-widest">No se requiere seguimiento para este caso</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in zoom-in-95 duration-300">
                            {/* Fechas Rápidas */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-amber-500" /> Atajos de Fecha
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {quickDates.map((qd) => (
                                        <Badge 
                                            key={qd.label} 
                                            variant="outline" 
                                            onClick={() => setQuickDate(qd.days)}
                                            className={cn(
                                                "cursor-pointer transition-all duration-300 py-2 px-4 rounded-xl border-slate-200 font-bold text-xs uppercase shadow-sm",
                                                "hover:bg-primary hover:text-white hover:border-primary hover:shadow-primary/20"
                                            )}
                                        >
                                            <CalendarIcon className="h-3 w-3 mr-2" /> {qd.label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                                 <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ">Fecha Próxima Cita</Label>
                                    <Input 
                                        type="date" 
                                        value={atencion.fechaSiguienteCita || ''} 
                                        onChange={(e) => handleChange('fechaSiguienteCita', e.target.value)} 
                                        className="rounded-xl border-slate-200 focus:ring-primary focus:border-primary bg-slate-50 h-10 font-bold"
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ">Tipo de Cita</Label>
                                    <Select value={atencion.tipoSiguienteCita} onValueChange={(value) => handleChange('tipoSiguienteCita', value)}>
                                        <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 h-10 font-bold">
                                            <SelectValue placeholder="Seleccione tipo..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="CONTROL">Control General</SelectItem>
                                            <SelectItem value="RESULTADO_EXAMEN">Revisión de Paraclínicos</SelectItem>
                                            <SelectItem value="OTRO">Seguimiento Especial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                 </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ">Instrucciones Internas</Label>
                                <Textarea 
                                    value={atencion.notasSeguimientoMedico || ''} 
                                    onChange={(e) => handleChange('notasSeguimientoMedico', e.target.value)} 
                                    placeholder="Instrucciones para el personal que realice el seguimiento..."
                                    className="rounded-2xl border-slate-200 focus:ring-primary focus:border-primary bg-slate-50 font-medium h-24"
                                />
                            </div>

                             <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                                        <BellRing className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-emerald-900 font-black tracking-tighter uppercase italic leading-none">Confirmar Registro</h4>
                                        <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest mt-1">Esto creará el recordatorio en el sistema automáticamente</p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={generarSeguimientoAutomatico} 
                                    disabled={!atencion.fechaSiguienteCita}
                                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-[10px] tracking-widest px-6"
                                >
                                    Generar Alerta
                                </Button>
                             </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
