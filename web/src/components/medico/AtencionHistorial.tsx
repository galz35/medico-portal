import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SemaforoBadge } from "@/components/shared/SemaforoBadge";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clipboard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AtencionHistorialProps {
  atenciones: any[];
}

export function AtencionHistorial({ atenciones }: AtencionHistorialProps) {
  if (!atenciones || atenciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 m-4">
        <Clipboard className="h-12 w-12 opacity-20" />
        <p className="text-sm font-medium italic">No se han registrado atenciones previas en este caso.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50 border-b">
          <TableRow>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] pl-8 h-12 flex items-center gap-2"><Calendar className="h-3 w-3" /> Fecha de Consulta</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] h-12 flex items-center gap-2"><User className="h-3 w-3" /> Médico Tratante</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] h-12">Detalle de Diagnóstico</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] text-center h-12">Evolución</TableHead>
            <TableHead className="font-bold text-slate-500 uppercase text-[10px] text-right pr-8 h-12">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {atenciones.map((atencion, index) => (
            <TableRow key={index} className="hover:bg-slate-50/80 transition-colors border-b last:border-0 group">
              <TableCell className="font-bold text-slate-900 pl-8">
                {new Date(atencion.fechaAtencion).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
              </TableCell>
              <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                <div className="flex flex-col">
                    <span>{atencion.medico_nombre || 'Dr. Médico de Turno'}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Medicina General</span>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-slate-500 text-xs line-clamp-2 italic leading-relaxed">
                   {atencion.diagnosticoPrincipal || "Sin detalles adicionales de diagnóstico."}
                </p>
              </TableCell>
              <TableCell className="text-center">
                <SemaforoBadge nivel={atencion.estadoClinico === 'MAL' ? 'R' : atencion.estadoClinico === 'REGULAR' ? 'A' : 'V'} className="scale-90" />
              </TableCell>
              <TableCell className="text-right pr-8">
                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4 text-primary" />
                 </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
