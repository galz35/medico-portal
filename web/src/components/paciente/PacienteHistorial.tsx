import { FileText, Calendar, Syringe, Activity, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const historial = [
  { fecha: '2026-04-15', tipo: 'Atención', descripcion: 'Control general - Presión normal', medico: 'Dr. García' },
  { fecha: '2026-03-20', tipo: 'Vacuna', descripcion: 'Influenza - Dosis anual', medico: 'Dra. Martínez' },
  { fecha: '2026-02-10', tipo: 'Examen', descripcion: 'Hemograma completo - Resultados normales', medico: 'Lab. Clínica' },
  { fecha: '2026-01-05', tipo: 'Chequeo', descripcion: 'Chequeo bienestar - Estado ánimo: Bueno', medico: 'Dr. García' },
];

export function PacienteHistorial() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
          Mi <span className="text-primary not-italic font-black">Historial</span>
        </h1>
        <p className="mt-1 text-slate-500 font-medium text-sm">
          Registro completo de tus atenciones médicas
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
        <div className="space-y-4">
          {historial.map((item, i) => (
            <div key={i} className="relative pl-10">
              <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-white" />
              <Card className="border-none shadow-md hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-wider">
                          {item.tipo}
                        </Badge>
                        <span className="text-xs text-slate-400">{item.fecha}</span>
                      </div>
                      <p className="font-semibold text-slate-900">{item.descripcion}</p>
                      <p className="text-sm text-slate-500">{item.medico}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
