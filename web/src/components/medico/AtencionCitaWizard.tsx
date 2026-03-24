

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StepHeaderWizard } from './StepHeaderWizard';
import { Button } from '@/components/ui/button';
import { AtencionMedica, CitaMedica, Paciente, EmpleadoEmp2024, EstadoClinico, VacunaAplicada, RegistroPsicosocial, SeguimientoGenerado, CasoClinico } from '@/lib/types/domain';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MedicoService } from '@/lib/services/medico.service';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Zap, Stethoscope, Printer } from 'lucide-react';

// Import steps
import { Step1_Resumen } from './steps/Step1_Resumen';
import { Step2_Vitales } from './steps/Step2_Vitales';
import { Step3_Diagnostico } from './steps/Step3_Diagnostico';
import { Step4_Seguimiento } from './steps/Step4_Seguimiento';
import { Step5_Cierre } from './steps/Step5_Cierre';


const TOTAL_STEPS = 5;

interface AtencionCitaWizardProps {
    citaData: {
        cita: CitaMedica;
        paciente: Paciente;
        empleado: EmpleadoEmp2024;
        caso: CasoClinico;
    };
}

export function AtencionCitaWizard({ citaData }: AtencionCitaWizardProps) {
    const { userProfile } = useUserProfile();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Main state for the medical attention
    const [atencion, setAtencion] = useState<AtencionMedica>({
        idAtencion: Date.now(),
        idCita: citaData.cita.id || 0,
        idCaso: citaData.cita.idCaso,
        idMedico: userProfile?.idMedico || citaData.cita.idMedico || 0,
        fechaAtencion: new Date().toISOString(),
        estadoClinico: 'BIEN',
        diagnosticoPrincipal: '',
        requiereSeguimiento: false,
    });

    const [vacunas, setVacunas] = useState<VacunaAplicada[]>([]);
    const [psico, setPsico] = useState<RegistroPsicosocial>({
        idRegistroPsico: Date.now(),
        idAtencion: (Date.now()).toString(), // Fixed potentially undefined
        idPaciente: citaData.paciente.id || 0,
        idMedico: userProfile?.idMedico || 0,
        fechaRegistro: new Date().toISOString(),
        confidencial: true,
        sintomasPsico: [],
    });
    const [seguimientos, setSeguimientos] = useState<SeguimientoGenerado[]>([]);

    const handleNext = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

    const handleChangeAtencion = (field: keyof AtencionMedica, value: any) => {
        setAtencion(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdatePsico = (field: keyof RegistroPsicosocial, value: any) => {
        setPsico(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const payload = {
            idCita: atencion.idCita,
            idMedico: atencion.idMedico,
            diagnosticoPrincipal: atencion.diagnosticoPrincipal,
            planTratamiento: atencion.planTratamiento,
            recomendaciones: atencion.recomendaciones,
            requiereSeguimiento: atencion.requiereSeguimiento,
            fechaSiguienteCita: atencion.fechaSiguienteCita,
            // Add other fields as needed by CrearAtencionDto
        };
        try {
            await MedicoService.crearAtencion(payload);
            setShowSummaryModal(true);
        } catch (error: any) {
            console.error("Error guardando la atención", error);
            toast({
                title: 'Error al Guardar',
                description: error.message || 'No se pudo registrar la atención.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };


    const stepConfig = useMemo(() => [
        { title: `Atención para: ${citaData.paciente.nombreCompleto}`, theme: 'primary', guide: 'Confirma los detalles de la cita y el contexto del paciente antes de continuar.' },
        { title: 'Signos Vitales y Estado Clínico', theme: 'slate', guide: 'Registra los signos vitales básicos y define el estado clínico general del paciente en esta consulta.' },
        { title: 'Diagnóstico y Plan', theme: 'green', guide: 'Establece el diagnóstico principal y detalla el plan de tratamiento y las recomendaciones.' },
        { title: 'Seguimiento', theme: 'gray', guide: 'Determina si el paciente necesita una cita de seguimiento y genera el recordatorio correspondiente.' },
        { title: 'Acciones Adicionales y Cierre', theme: 'dark', guide: 'Registra acciones de la empresa, notas psicosociales y revisa el resumen antes de guardar.' },
    ], [citaData.paciente.nombreCompleto]);

    const currentStepConfig = stepConfig[step - 1];

    return (
        <Card className='overflow-hidden'>
            <StepHeaderWizard
                step={step}
                totalSteps={TOTAL_STEPS}
                title={currentStepConfig.title}
                theme={currentStepConfig.theme as any}
                guide={currentStepConfig.guide}
            />
            <CardContent className="p-6">
                {step === 1 && <Step1_Resumen citaData={citaData} />}
                {step === 2 && <Step2_Vitales atencion={atencion} handleChange={handleChangeAtencion} />}
                {step === 3 && <Step3_Diagnostico atencion={atencion} handleChange={handleChangeAtencion} />}
                {step === 4 && <Step4_Seguimiento atencion={atencion} handleChange={handleChangeAtencion} setSeguimientos={setSeguimientos} idPaciente={citaData.paciente.id!} />}
                {step === 5 && <Step5_Cierre atencion={atencion} vacunas={vacunas} setVacunas={setVacunas} psico={psico} setPsico={handleUpdatePsico} idPaciente={citaData.paciente.id!.toString()} />}

                <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={handlePrev} disabled={step === 1 || isSaving}>
                        ← Anterior
                    </Button>
                    {step < TOTAL_STEPS ? (
                        <Button onClick={handleNext} disabled={isSaving}>
                            Siguiente →
                        </Button>
                    ) : (
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Guardar Atención'}
                        </Button>
                    )}
                </div>
            </CardContent>

            <AlertDialog open={showSummaryModal}>
                <AlertDialogContent className="max-w-xl rounded-3xl border-none shadow-2xl overflow-hidden p-0">
                    <div className="bg-emerald-600 p-8 text-white flex flex-col items-center justify-center gap-4">
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm animate-bounce">
                            <CheckCircle2 className="h-12 w-12 text-white" />
                        </div>
                        <div className="text-center">
                            <AlertDialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Registro Completado</AlertDialogTitle>
                            <AlertDialogDescription className="text-emerald-100 font-bold opacity-90 text-sm mt-1 uppercase tracking-widest leading-none">
                                La atención médica ha sido guardada con éxito
                            </AlertDialogDescription>
                        </div>
                    </div>

                    <div className="p-8 space-y-6 bg-white">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                    <Stethoscope className="h-3 w-3" /> Paciente
                                </Label>
                                <p className="text-sm font-black text-slate-900 truncate uppercase mt-1 leading-none">{citaData.paciente.nombreCompleto}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                                    <Zap className="h-3 w-3 text-amber-500" /> Diagnóstico
                                </Label>
                                <p className="text-xs font-bold text-slate-700 leading-tight line-clamp-2 mt-1">{atencion.diagnosticoPrincipal || 'Control de Rutina'}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Resumen de Acciones</Label>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="rounded-xl py-1 px-3 border-emerald-100 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase">
                                    Atención #{atencion.idAtencion.toString().slice(-4)}
                                </Badge>
                                {atencion.requiereSeguimiento && (
                                    <Badge variant="outline" className="rounded-xl py-1 px-3 border-indigo-100 bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase">
                                        Seguimiento: {atencion.fechaSiguienteCita}
                                    </Badge>
                                )}
                                {vacunas.length > 0 && (
                                    <Badge variant="outline" className="rounded-xl py-1 px-3 border-amber-100 bg-amber-50 text-amber-700 font-bold text-[10px] uppercase">
                                        {vacunas.length} Vacunas Aplicadas
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                            <Button variant="outline" className="flex-1 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest h-12 hover:bg-slate-50">
                                <Printer className="h-4 w-4 mr-2" /> Comprobante
                            </Button>
                            <AlertDialogAction 
                                onClick={() => window.location.href = '/medico/agenda-citas'}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 font-bold text-xs uppercase tracking-widest h-12"
                            >
                                Finalizar & Salir
                            </AlertDialogAction>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
