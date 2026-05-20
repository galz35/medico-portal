import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  FileDown, 
  FileText, 
  Calendar as CalendarIcon,
  ChevronRight,
  Stethoscope,
  Info,
  Clock,
  Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SemaforoBadge } from '@/components/shared/SemaforoBadge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { MedicoService } from '@/lib/services/medico.service';
import type { Paciente } from '@/lib/types/domain';

export function HistorialPaciente() {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        MedicoService.getPacientes()
            .then(data => {
                setPacientes(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                setError(err?.response?.data?.message || err?.message || 'Error al cargar pacientes');
            })
            .finally(() => setLoading(false));
    }, []);

    const registros = pacientes.map((p, idx) => ({
        id: p.id_paciente ?? idx + 1,
        fecha: p.fecha_nacimiento ? new Date(p.fecha_nacimiento).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        carnet: p.carnet,
        nombre: p.nombre_completo,
        gerencia: p.gerencia || 'Sin asignar',
        area: p.area || 'General',
        modalidad: p.pais === 'NI' ? 'Presencial' : 'Remoto',
        apto: p.estado_paciente === 'A',
        triage: p.nivel_semaforo || 'V',
        comentario: `Paciente registrado. Último semáforo: ${p.nivel_semaforo || 'N/A'}`
    }));

    const filtered = registros.filter(r => 
        r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.carnet.includes(searchTerm) ||
        r.gerencia.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header / Filtros */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Historial Clínico</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 font-black italic tracking-tight">
                        <Clock className="h-3 w-3" /> Registros de salud acumulados - Empresa
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border shadow-sm border-slate-100">
                    <div className="flex items-center gap-2 px-3">
                         <CalendarIcon className="h-4 w-4 text-slate-400" />
                         <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border-none bg-transparent font-bold text-xs w-32 focus-visible:ring-0 p-0 h-8" />
                         <span className="text-slate-300">/</span>
                         <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border-none bg-transparent font-bold text-xs w-32 focus-visible:ring-0 p-0 h-8" />
                    </div>
                    <Button variant="outline" className="rounded-xl border-slate-200 font-black uppercase text-[10px] tracking-widest h-10 px-4">
                        <Filter className="h-3 w-3 mr-2" /> Filtrar
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest h-10 px-4 shadow-lg shadow-emerald-900/20">
                        <FileDown className="h-4 w-4 mr-2" /> Excel Rango
                    </Button>
                </div>
            </div>

            {/* Listado Principal */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                            <Input 
                                placeholder="Carnet, Nombre o Gerencia..." 
                                className="pl-10 rounded-2xl border-slate-200 bg-slate-50 font-bold text-sm h-11 focus:ring-slate-900 focus:border-slate-900" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="rounded-xl py-1.5 px-3 border-slate-100 bg-slate-50 text-slate-400 font-black text-[10px] uppercase">{filtered.length} Registros</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="ml-3 text-slate-500 font-medium">Cargando pacientes...</span>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-40 text-red-500 font-medium">
                            Error: {error}
                        </div>
                    ) : (
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100 italic">
                                <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 pl-8">Fecha / Registro</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest">Colaborador</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Datos</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Triage</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Apto</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8 uppercase">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length > 0 ? filtered.map((r) => (
                                <TableRow key={r.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                                    <TableCell className="py-5 pl-8">
                                        <p className="font-black text-slate-900 uppercase text-[11px] tracking-tight">{r.fecha}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID #{r.id}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="font-black italic text-slate-900 uppercase text-sm tracking-tight">{r.nombre}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.gerencia} · {r.area}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-xs text-slate-600 uppercase italic">
                                        {r.modalidad}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <SemaforoBadge nivel={r.triage} className="scale-90" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={r.apto ? 'default' : 'destructive'} className="font-black uppercase text-[9px] rounded-full px-3 py-1 bg-emerald-500">
                                            {r.apto ? 'SÍ' : 'NO'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2 pr-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="rounded-xl h-9 hover:bg-slate-100 text-slate-400 hover:text-slate-900 px-3 flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        <span className="font-black text-[10px] uppercase">Detalle</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                                                    <div className="bg-slate-900 p-8 text-white">
                                                         <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Detalle de Registro</DialogTitle>
                                                                <DialogDescription className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-none">ID: {r.id} · Fecha: {r.fecha}</DialogDescription>
                                                            </div>
                                                            <SemaforoBadge nivel={r.triage} />
                                                         </div>
                                                    </div>
                                                    <div className="p-8 space-y-6">
                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div className="space-y-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Colaborador</Label>
                                                                    <p className="font-black italic text-slate-900 uppercase text-lg leading-none">{r.nombre}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Carnet</Label>
                                                                    <p className="font-bold text-slate-600 italic">#{r.carnet}</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gerencia / Área</Label>
                                                                    <p className="font-bold text-slate-600 text-sm uppercase leading-tight">{r.gerencia} <br/> {r.area}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Modalidad</Label>
                                                                    <p className="font-bold text-slate-600 text-sm uppercase">{r.modalidad}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                                                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                                <Info className="h-3 w-3" /> Hallazgos y Comentarios
                                                            </Label>
                                                            <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                                                "{r.comentario}"
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-center">
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Apto Laboral</p>
                                                                    <Badge className={cn("mt-1 rounded-full px-3 py-1", r.apto ? "bg-emerald-500" : "bg-rose-500")}>
                                                                        {r.apto ? 'SÍ' : 'NO'}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10 px-6">
                                                                    <Printer className="h-4 w-4 mr-2" /> PDF
                                                                </Button>
                                                                <Button variant="outline" className="rounded-xl border-emerald-200 text-emerald-700 font-black uppercase text-[10px] tracking-widest h-10 px-6 hover:bg-emerald-50">
                                                                    <FileDown className="h-4 w-4 mr-2" /> Excel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-300 hover:text-primary">
                                                <Printer className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium italic">
                                        No se encontraron pacientes con los criterios de búsqueda.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>{children}</label>;
}
