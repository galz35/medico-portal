import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AtencionMedica, EstadoClinico, SemaforoNivel } from "@/lib/types/domain";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Stethoscope, Activity, ClipboardCheck, Zap, Thermometer, ShieldAlert, HeartPulse, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { SemaforoBadge } from "@/components/shared/SemaforoBadge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Step3Props {
  atencion: AtencionMedica;
  handleChange: (field: keyof AtencionMedica, value: any) => void;
}

export function Step3_Diagnostico({ atencion, handleChange }: Step3Props) {
  
  const commonDiagnosticos = ["Faringitis Aguda", "Lumbago No Especificado", "Cefalea Tensional", "Gastroenteritis", "Control Hipertensión", "Infección Urinaria"];
  const commonPlanes = ["Reposo 3 días + Hidratación", "Paracetamol 500mg c/8h", "Analgésicos + Compresas", "Exámenes de Laboratorio", "Dieta Blanda", "Continuar Tratamiento Crónico"];

  const handleShortcut = (field: 'diagnosticoPrincipal' | 'planTratamiento', value: string) => {
    const current = atencion[field] || '';
    const newValue = current ? `${current}. ${value}` : value;
    handleChange(field, newValue);
  };

  const getNivel = (estado?: EstadoClinico): SemaforoNivel => {
    if (estado === 'BIEN') return 'V';
    if (estado === 'REGULAR') return 'A';
    if (estado === 'MAL') return 'R';
    return 'V';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Sección Triage / Síntomas Detallados (Inspirado en Legacy Step 2) */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 p-2 rounded-lg shadow-lg shadow-slate-200">
                        <HeartPulse className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-slate-900 font-black tracking-tight text-lg italic uppercase italic leading-none">Evaluación Síntomas & Triage</CardTitle>
                        <CardDescription className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Intensidad y Hallazgos Clínicos</CardDescription>
                    </div>
                </div>
                <SemaforoBadge nivel={getNivel(atencion.estadoClinico)} />
            </div>
        </CardHeader>
        <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Intensidad (0-10) - LEGACY REPLICA */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                            <Activity className="h-4 w-4 text-rose-500" /> Intensidad del Malestar
                        </Label>
                        <Badge variant="outline" className="rounded-xl px-3 py-1 bg-rose-50 text-rose-600 font-black italic border-rose-100">
                             {atencion.temperaturaC || 5}/10
                        </Badge>
                    </div>
                    <div className="pt-2 px-2">
                        <Slider 
                            defaultValue={[atencion.temperaturaC || 5]} 
                            max={10} 
                            step={1} 
                            onValueChange={(val) => handleChange('temperaturaC' as any, val[0])} // Usamos temperaturaC temporalmente para el slider si no hay otro campo
                            className={cn(
                                "cursor-pointer",
                                (atencion.temperaturaC || 5) > 7 ? "[&_span:last-child]:bg-rose-600" : (atencion.temperaturaC || 5) > 4 ? "[&_span:last-child]:bg-amber-500" : "[&_span:last-child]:bg-emerald-500"
                            )}
                        />
                        <div className="flex justify-between mt-2 px-1">
                            <span className="text-[9px] font-bold text-slate-300 uppercase">Leve</span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase">Moderado</span>
                            <span className="text-[9px] font-bold text-slate-300 uppercase">Intenso</span>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Localización / Lado</Label>
                        <div className="flex gap-2">
                            {['Izquierdo', 'Derecho', 'Ambos', 'N/A'].map(lado => (
                                <Badge 
                                    key={lado} 
                                    variant="outline" 
                                    className={cn(
                                        "cursor-pointer rounded-xl font-black uppercase text-[10px] px-4 py-2 hover:bg-slate-50 transition-all",
                                        atencion.notasSeguimientoMedico === lado ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-500"
                                    )}
                                    onClick={() => handleChange('notasSeguimientoMedico', lado)}
                                >
                                    {lado}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Triage Alerts (Legacy Logic) */}
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                     <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3 text-amber-500" /> Factores de Urgencia
                    </Label>
                    <div className="space-y-3">
                         <div className="flex flex-wrap gap-2">
                            {["Fiebre persistente", "Disnea", "Dolor en pecho", "Mareo brusco"].map(u => (
                                <Badge key={u} variant="secondary" className="rounded-xl px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-bold text-[10px] uppercase cursor-pointer hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">
                                    {u}
                                </Badge>
                            ))}
                         </div>
                         <div className="pt-4 border-t border-slate-200/60 mt-4">
                             <div className="flex items-center gap-3">
                                 <Info className="h-4 w-4 text-indigo-500" />
                                 <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                                     El Triage automático registra un nivel <strong className={cn((atencion.temperaturaC || 0) > 7 ? "text-rose-600" : "text-emerald-600")}>
                                     {(atencion.temperaturaC || 0) > 7 ? 'AMARILLO (Monitorizar)' : 'VERDE (Plan Normal)'}
                                     </strong> basado en la intensidad.
                                 </p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {/* Diagnóstico */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-200">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-emerald-900 font-black tracking-tight text-lg italic uppercase">Diagnóstico Clínico</CardTitle>
                <CardDescription className="text-emerald-700 font-bold text-[10px] uppercase tracking-widest mt-1 italic">Conclusión de la Evaluación</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Textarea 
              placeholder="Escribe el diagnóstico impresión diagnóstica..." 
              className="rounded-2xl border-slate-200 bg-slate-50 font-medium h-32 focus:ring-emerald-500 focus:border-emerald-500"
              value={atencion.diagnosticoPrincipal || ''}
              onChange={(e) => handleChange('diagnosticoPrincipal', e.target.value)}
            />
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-black italic">Atajos de Diagnóstico</Label>
              <div className="flex flex-wrap gap-2">
                {commonDiagnosticos.map((diag) => (
                  <Badge 
                    key={diag} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all rounded-xl px-3 py-1.5 border-emerald-100 text-emerald-700 font-bold text-[10px] uppercase"
                    onClick={() => handleShortcut('diagnosticoPrincipal', diag)}
                  >
                    + {diag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan de Tratamiento */}
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-white font-black tracking-tight text-lg italic uppercase italic leading-none">Plan de Tratamiento</CardTitle>
                <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1 italic">Acciones Médicas a Seguir</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Textarea 
              placeholder="Instrucciones para el paciente, dosis de medicamentos..." 
              className="rounded-2xl border-slate-200 bg-slate-50 font-medium h-32 focus:ring-slate-900 focus:border-slate-900 text-sm"
              value={atencion.planTratamiento || ''}
              onChange={(e) => handleChange('planTratamiento', e.target.value)}
            />
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-black italic">Atajos de Plan</Label>
              <div className="flex flex-wrap gap-2">
                {commonPlanes.map((plan) => (
                  <Badge 
                    key={plan} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all rounded-xl px-3 py-1.5 border-slate-100 text-slate-500 font-bold text-[10px] uppercase"
                    onClick={() => handleShortcut('planTratamiento', plan)}
                  >
                    + {plan}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
