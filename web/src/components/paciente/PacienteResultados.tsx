import { FileText, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const resultados = [
  { fecha: '2026-04-10', tipo: 'Hemograma', estado: 'Disponible', valor: 'Normal', medico: 'Dr. García' },
  { fecha: '2026-03-05', tipo: 'Perfil Lipídico', estado: 'Disponible', valor: 'Normal', medico: 'Dra. Martínez' },
  { fecha: '2026-02-20', tipo: 'Glucosa', estado: 'Disponible', valor: 'Alto', medico: 'Dr. García' },
  { fecha: '2026-01-15', tipo: 'Orina', estado: 'Disponible', valor: 'Normal', medico: 'Lab. Clínica' },
];

export function PacienteResultados() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
          Mis <span className="text-primary not-italic font-black">Resultados</span>
        </h1>
        <p className="mt-1 text-slate-500 font-medium text-sm">
          Exámenes y resultados de laboratorio
        </p>
      </div>

      <div className="grid gap-4">
        {resultados.map((r, i) => (
          <Card key={i} className="border-none shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{r.tipo}</h3>
                      <Badge className={r.valor === 'Normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                        {r.valor}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">{r.fecha} · {r.medico}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
