import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AtencionMedica, VacunaAplicada, RegistroPsicosocial, EstadoClinico, SemaforoNivel } from "@/lib/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Syringe, BrainCircuit, ShieldAlert, CheckCircle2, AlertTriangle, Info, Plus } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';

const VacunasEmpresaBlock: React.FC<{ vacunas: VacunaAplicada[], setVacunas: React.Dispatch<React.SetStateAction<VacunaAplicada[]>>, idAtencion: number, idPaciente: number }> = ({ vacunas, setVacunas, idAtencion, idPaciente }) => {
    
    const handleAdd = () => {
        setVacunas(prev => [...prev, { 
            id_vacuna_registro: Date.now(), 
            id_atencion: idAtencion, 
            tipo_vacuna: '', 
            dosis: '', 
            fecha_aplicacion: new Date().toISOString().split('T')[0], 
            id_paciente: idPaciente 
        }]);
    };
    
    const handleRemove = (id: number) => {
        setVacunas(prev => prev.filter(v => v.id_vacuna_registro !== id));
    };

    const handleChange = (id: number, field: keyof VacunaAplicada, value: any) => {
        setVacunas(prev => prev.map(v => v.id_vacuna_registro === id ? { ...v, [field]: value } : v));
    };

    const commonVaccines = ["Influenza", "Tétanos", "Hepatitis B", "COVID-19", "Refuerzo"];

    return (
        <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-indigo-50 border-b border-indigo-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
                        <Syringe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-indigo-900 font-black tracking-tight text-lg italic uppercase">Vacunación & Acciones</CardTitle>
                        <CardDescription className="text-indigo-700 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                            Inmunización y Preventivos de Empresa
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {vacunas.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No se han registrado vacunas en esta atención</p>
                        <Button variant="outline" size="sm" onClick={handleAdd} className="mt-4 rounded-xl font-black uppercase text-[10px] tracking-widest">
                            <Plus className="h-3 w-3 mr-2" /> Iniciar Registro
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {vacunas.map(vacuna => (
                            <div key={vacuna.id_vacuna_registro} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-end animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="md:col-span-4 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Inmunobiológico</Label>
                                    <div className="flex flex-col gap-2">
                                        <Input 
                                            placeholder="Nombre vacuna" 
                                            value={vacuna.tipo_vacuna} 
                                            onChange={(e) => handleChange(vacuna.id_vacuna_registro, 'tipo_vacuna', e.target.value)}
                                            className="rounded-xl border-slate-200 bg-white font-bold h-9 text-xs"
                                        />
                                        <div className="flex flex-wrap gap-1">
                                            {commonVaccines.map(v => (
                                                <Badge 
                                                    key={v} 
                                                    variant="secondary" 
                                                    className="text-[9px] cursor-pointer hover:bg-indigo-100"
                                                    onClick={() => handleChange(vacuna.id_vacuna_registro, 'tipo_vacuna', v)}
                                                >
                                                    {v}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dosis</Label>
                                    <Input 
                                        placeholder="Ej: 1ra, Refuerzo" 
                                        value={vacuna.dosis} 
                                        onChange={(e) => handleChange(vacuna.id_vacuna_registro, 'dosis', e.target.value)} 
                                        className="rounded-xl border-slate-200 bg-white font-bold h-9 text-xs"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha</Label>
                                    <Input 
                                        type="date" 
                                        value={vacuna.fecha_aplicacion} 
                                        onChange={(e) => handleChange(vacuna.id_vacuna_registro, 'fecha_aplicacion', e.target.value)} 
                                        className="rounded-xl border-slate-200 bg-white font-bold h-9 text-xs"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lote / Notas</Label>
                                    <Input 
                                        placeholder="Opcional..." 
                                        value={vacuna.observaciones || ''} 
                                        onChange={(e) => handleChange(vacuna.id_vacuna_registro, 'observaciones', e.target.value)} 
                                        className="rounded-xl border-slate-200 bg-white font-bold h-9 text-xs"
                                    />
                                </div>
                                <div className="md:col-span-1 flex justify-end">
                                    <Button variant="ghost" size="icon" onClick={() => handleRemove(vacuna.id_vacuna_registro)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl">
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" onClick={handleAdd} className="w-full rounded-2xl border border-dashed border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                            <Plus className="h-4 w-4 mr-2" /> Agregar otra aplicación
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const PsicosocialBlock: React.FC<{ psico: RegistroPsicosocial, setPsico: (field: keyof RegistroPsicosocial, value: any) => void }> = ({ psico, setPsico }) => {
    
    const sintomas = ['Ansiedad', 'Insomnio', 'Tristeza', 'Irritabilidad', 'Desmotivación', 'Apatía', 'Estrés Laboral', 'Fatiga Crónica'];

    const handleSintomaChange = (sintoma: string, checked: boolean) => {
        const currentSintomas = psico.sintomasPsico || [];
        const newSintomas = checked ? [...currentSintomas, sintoma] : currentSintomas.filter(s => s !== sintoma);
        setPsico('sintomasPsico', newSintomas);
    };
    
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="psico" className="border-none">
                <AccordionTrigger className="hover:no-underline py-0">
                    <Card className="w-full border-none shadow-sm overflow-hidden bg-white text-left text-left-important">
                        <CardHeader className="bg-amber-50 border-b border-amber-100 pb-4">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-600 p-2 rounded-lg shadow-lg shadow-amber-200">
                                        <BrainCircuit className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-amber-900 font-black tracking-tight text-lg italic uppercase">Bienestar Psicosocial</CardTitle>
                                        <CardDescription className="text-amber-700 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                                            Evaluación del Entorno y Salud Mental
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-xl border border-amber-200" onClick={(e) => e.stopPropagation()}>
                                    <Switch id="confidencial" checked={psico.confidencial} onCheckedChange={(c) => setPsico('confidencial', c)} />
                                    <Label htmlFor="confidencial" className="text-[9px] font-black uppercase text-amber-800">Confidencial</Label>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-0">
                    <Card className="border-none shadow-none bg-white">
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nivel de Estrés Percibido</Label>
                                <div className="flex flex-wrap gap-2">
                                    {(['Bajo', 'Medio', 'Alto'] as const).map(level => (
                                         <Badge 
                                            key={level} 
                                            onClick={() => setPsico('nivelEstres', level)} 
                                            className={cn(
                                                'cursor-pointer py-2 px-6 rounded-xl transition-all duration-300 font-black uppercase text-xs tracking-tighter',
                                                psico.nivelEstres === level 
                                                    ? (level === 'Bajo' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : level === 'Medio' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-rose-600 text-white shadow-lg shadow-rose-200')
                                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                            )}
                                         >
                                            {level}
                                         </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Síntomas Reportados</Label>
                                 <div className="flex flex-wrap gap-2">
                                    {sintomas.map(sintoma => (
                                        <Badge 
                                            key={sintoma} 
                                            variant={psico.sintomasPsico?.includes(sintoma) ? 'default' : 'outline'}
                                            className={cn(
                                                "cursor-pointer rounded-xl py-1.5 px-3 font-bold text-[11px] uppercase transition-all",
                                                psico.sintomasPsico?.includes(sintoma) ? "bg-slate-900" : "text-slate-500 border-slate-200"
                                            )}
                                            onClick={() => handleSintomaChange(sintoma, !psico.sintomasPsico?.includes(sintoma))}
                                        >
                                            {sintoma}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                 <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Observaciones Clínicas</Label>
                                 <Textarea 
                                    placeholder="Narrativa del paciente y hallazgos del médico..." 
                                    className="rounded-2xl border-slate-200 bg-slate-50 font-medium h-24 text-sm"
                                    value={psico.notasPsico || ''} 
                                    onChange={(e) => setPsico('notasPsico', e.target.value)} 
                                />
                            </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                    psico.riesgoSuicida ? "bg-rose-50 border-rose-200 shadow-lg shadow-rose-100" : "bg-slate-50 border-slate-100"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <ShieldAlert className={cn("h-5 w-5", psico.riesgoSuicida ? "text-rose-600" : "text-slate-300")} />
                                        <Label htmlFor="riesgo-suicida" className={cn("text-xs font-black uppercase tracking-tight", psico.riesgoSuicida ? "text-rose-900" : "text-slate-400")}>Riesgo Crítico / Suicida</Label>
                                    </div>
                                    <Checkbox id="riesgo-suicida" checked={psico.riesgoSuicida} onCheckedChange={(c) => setPsico('riesgoSuicida', !!c)} />
                                </div>
                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                    psico.derivarAPsico ? "bg-indigo-50 border-indigo-200 shadow-lg shadow-indigo-100" : "bg-slate-50 border-slate-100"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <BrainCircuit className={cn("h-5 w-5", psico.derivarAPsico ? "text-indigo-600" : "text-slate-300")} />
                                        <Label htmlFor="derivar-psico" className={cn("text-xs font-black uppercase tracking-tight", psico.derivarAPsico ? "text-indigo-900" : "text-slate-400")}>Derivar a Especialidad</Label>
                                    </div>
                                    <Checkbox id="derivar-psico" checked={psico.derivarAPsico} onCheckedChange={(c) => setPsico('derivarAPsico', !!c)} />
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};


interface Step5Props {
    atencion: AtencionMedica;
    vacunas: VacunaAplicada[];
    setVacunas: React.Dispatch<React.SetStateAction<VacunaAplicada[]>>;
    psico: RegistroPsicosocial;
    setPsico: (field: keyof RegistroPsicosocial, value: any) => void;
    idPaciente: string;
}

export function Step5_Cierre({ atencion, vacunas, setVacunas, psico, setPsico, idPaciente }: Step5Props) {
    const getNivel = (estado?: EstadoClinico): SemaforoNivel => {
        if (estado === 'BIEN') return 'V';
        if (estado === 'REGULAR') return 'A';
        if (estado === 'MAL') return 'R';
        return 'V';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-8">
            <VacunasEmpresaBlock 
                vacunas={vacunas} 
                setVacunas={setVacunas} 
                idAtencion={atencion.id_atencion || atencion.idAtencion || 0} 
                idPaciente={parseInt(idPaciente)} 
            />
            <PsicosocialBlock psico={psico} setPsico={setPsico} />

            <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <CheckCircle2 className="h-32 w-32" />
                </div>
                <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-white font-black tracking-tight text-lg italic uppercase italic leading-none">Revisión Final & Cierre</CardTitle>
                            <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Sumario de la Transacción Médica</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4 border-r border-white/10 pr-4">
                            <Label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                                <Info className="h-3 w-3" /> Estado Clínico
                            </Label>
                            <div className="flex items-center gap-4">
                                 <SemaforoBadge nivel={getNivel(atencion.estadoClinico)} />
                                 <div className="text-xs font-bold text-slate-300 italic">
                                    {atencion.estadoClinico === 'BIEN' ? 'Paciente Estable' : atencion.estadoClinico === 'REGULAR' ? 'Requiere Vigilancia' : 'Paciente Comprometido'}
                                 </div>
                            </div>
                        </div>
                        <div className="space-y-4 border-r border-white/10 pr-4">
                            <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3" /> Diagnóstico & Plan
                            </Label>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-white italic leading-tight truncate">{atencion.diagnosticoPrincipal || 'Sin diagnóstico'}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{atencion.requiereSeguimiento ? `Seguimiento: ${atencion.fecha_siguiente_cita || atencion.fechaSiguienteCita}` : 'Cita Única'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase text-amber-500 tracking-widest flex items-center gap-2">
                                <Plus className="h-3 w-3" /> Resumen de Registros
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-white/5 text-slate-200 border-white/10 text-[9px] font-black uppercase">{vacunas.length} Acciones/Vacunas</Badge>
                                <Badge variant="secondary" className="bg-white/5 text-slate-200 border-white/10 text-[9px] font-black uppercase">{psico.sintomasPsico?.length || 0} Psicosociales</Badge>
                                {atencion.requiereSeguimiento && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px] font-black uppercase">Seguimiento Activo</Badge>}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
