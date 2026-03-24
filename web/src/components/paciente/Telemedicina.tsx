import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, Calendar, Clock, PhoneCall, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Telemedicina() {
    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Telemedicina</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Consultas Virtuales y Soporte Remoto</p>
                </div>
                <Button className="bg-primary text-white font-black italic rounded-xl px-6 py-6 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <Video className="mr-2 h-5 w-5" /> SOLICITAR VIDEO-LLAMADA
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 italic">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <Clock className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-sm font-black uppercase">Próximas Sesiones</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 text-center py-12">
                        <Calendar className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No tienes citas virtuales agendadas</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-none shadow-sm bg-slate-900 text-white overflow-hidden">
                    <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-primary font-black text-[10px] uppercase">
                                <Info className="h-3 w-3" /> Estado del Servicio: Disponible
                            </div>
                            <h2 className="text-2xl font-black italic tracking-tight italic uppercase italic leading-none">¿Necesitas hablar con un médico ahora?</h2>
                            <p className="text-slate-400 font-medium text-sm leading-relaxed">
                                Nuestra red de médicos está disponible para atenderte en línea. Conéctate desde cualquier lugar de forma segura y privada.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <Button variant="secondary" className="rounded-xl font-black italic px-6">VER MÉDICOS EN LÍNEA</Button>
                                <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-bold">GUÍA DE USO</Button>
                            </div>
                        </div>
                        <div className="relative">
                           <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                           <PhoneCall className="h-32 w-32 text-primary relative z-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
