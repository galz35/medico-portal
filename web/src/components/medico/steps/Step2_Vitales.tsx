import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AtencionMedica, EstadoClinico } from "@/lib/types/domain";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    AlertTriangle, 
    Thermometer, 
    Weight, 
    Ruler, 
    Heart, 
    Activity, 
    CheckCircle2, 
    HelpCircle, 
    XCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step2Props {
    atencion: AtencionMedica;
    handleChange: (field: keyof AtencionMedica, value: any) => void;
}

const VitalSignInput = ({ label, icon: Icon, unit, ...props }: any) => (
  <div className="space-y-2 group">
    <div className="flex items-center gap-2">
       <Icon className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
       <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
    </div>
    <div className="relative">
        <Input 
            className="h-12 border-slate-200 focus:ring-primary focus:border-primary pr-12 text-lg font-semibold" 
            {...props} 
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">{unit}</span>
    </div>
  </div>
);

const estadoClinicoOptions: { value: EstadoClinico, label: string, icon: any, color: string }[] = [
    { value: 'BIEN', label: 'Estable / Bien', icon: CheckCircle2, color: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' },
    { value: 'REGULAR', label: 'Regular / Observación', icon: HelpCircle, color: 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' },
    { value: 'MAL', label: 'Crítico / Mal', icon: XCircle, color: 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100' }
];

export function Step2_Vitales({ atencion, handleChange }: Step2Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b pb-4">
                    <CardTitle className="text-xl">Signos Vitales y Biometría</CardTitle>
                    <CardDescription>Ingresa los datos físicos medidos durante la cita actual.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <VitalSignInput 
                        label="Temperatura" icon={Thermometer} unit="°C" 
                        type="number" step="0.1" value={atencion.temperaturaC || ''} 
                        onChange={(e: any) => handleChange('temperaturaC', e.target.valueAsNumber)} 
                    />
                    <VitalSignInput 
                        label="Peso Corporal" icon={Weight} unit="Kg" 
                        type="number" step="0.1" value={atencion.pesoKg || ''} 
                        onChange={(e: any) => handleChange('pesoKg', e.target.valueAsNumber)} 
                    />
                    <VitalSignInput 
                        label="Altura / Talla" icon={Ruler} unit="m" 
                        type="number" step="0.01" value={atencion.alturaM || ''} 
                        onChange={(e: any) => handleChange('alturaM', e.target.valueAsNumber)} 
                    />
                    <VitalSignInput 
                        label="Frecuencia Cardíaca" icon={Heart} unit="LPM" 
                        type="number" value={atencion.frecuenciaCardiaca || ''} 
                        onChange={(e: any) => handleChange('frecuenciaCardiaca', e.target.valueAsNumber)} 
                    />
                    <VitalSignInput 
                        label="Presión Arterial" icon={Activity} unit="mmHg" 
                        placeholder="120/80" value={atencion.presionArterial || ''} 
                        onChange={(e: any) => handleChange('presionArterial', e.target.value)} 
                    />
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader className="bg-slate-50 border-b pb-4">
                    <CardTitle className="text-xl">Diagnóstico de Estado General</CardTitle>
                    <CardDescription>Evaluación clínica subjetiva del paciente al concluir el triaje.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {estadoClinicoOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleChange('estadoClinico', option.value)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 gap-3 group",
                                    atencion.estadoClinico === option.value 
                                        ? `${option.color} ring-4 ring-offset-2 ${option.value === 'BIEN' ? 'ring-emerald-100' : option.value === 'REGULAR' ? 'ring-amber-100' : 'ring-rose-100'}` 
                                        : "border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                <option.icon className={cn("h-8 w-8 mb-1", atencion.estadoClinico === option.value ? "" : "opacity-30")} />
                                <span className={cn("text-sm font-bold uppercase tracking-wide")}>{option.label}</span>
                            </button>
                        ))}
                     </div>
                     
                     {atencion.estadoClinico === 'MAL' && (
                        <Alert 
                            variant="destructive" 
                            className="bg-rose-50 border-rose-100 border-2 rounded-2xl animate-in zoom-in-95 duration-300"
                        >
                            <AlertTriangle className="h-5 w-5 text-rose-600" />
                            <AlertTitle className="text-rose-700 font-bold ml-2 underline">¡ALERTA CLÍNICA!</AlertTitle>
                            <AlertDescription className="text-rose-600 font-medium ml-2">
                                Se ha detectado un estado crítico. El sistema recomendará derivación automática a especialista en el paso final.
                            </AlertDescription>
                        </Alert>
                     )}
                </CardContent>
            </Card>
        </div>
    );
}
