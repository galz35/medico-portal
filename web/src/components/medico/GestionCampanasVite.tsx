import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Syringe, 
  Search, 
  Upload, 
  UserCheck, 
  UserX, 
  Users, 
  ShieldCheck, 
  ClipboardList, 
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function GestionCampanasVite() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock de colaboradores para la campaña
    const [colaboradores, setColaboradores] = useState([
        { id: 1, carnet: '102938', nombre: 'Carlos Ruiz', gerencia: 'Sistemas', estado: 'PENDIENTE', dosis: '-', fecha: '-' },
        { id: 2, carnet: '102940', nombre: 'Elena Sosa', gerencia: 'RRHH', estado: 'VACUNADO', dosis: 'Única', fecha: '2024-03-15' },
        { id: 3, carnet: '102945', nombre: 'Luis Mejía', gerencia: 'Ventas', estado: 'PENDIENTE', dosis: '-', fecha: '-' },
        { id: 4, carnet: '102950', nombre: 'Ana Bueso', gerencia: 'Sistemas', estado: 'VACUNADO', dosis: 'Única', fecha: '2024-03-16' },
        { id: 5, carnet: '102955', nombre: 'Marta Solis', gerencia: 'Logística', estado: 'EXENTADO', dosis: '-', fecha: '-' },
    ]);

    const handleVacunar = (id: number) => {
        setColaboradores(prev => prev.map(c => 
            c.id === id ? { ...c, estado: 'VACUNADO', dosis: 'Única', fecha: new Date().toISOString().split('T')[0] } : c
        ));
        toast({ title: 'Registro Exitoso', description: 'Colaborador marcado como vacunado.', variant: 'default' });
    };

    const handleExentar = (id: number) => {
        setColaboradores(prev => prev.map(c => 
            c.id === id ? { ...c, estado: 'EXENTADO', dosis: '-', fecha: '-' } : c
        ));
    };

    const filtered = colaboradores.filter(c => 
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.carnet.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Campaña Header Card */}
            <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Syringe className="h-48 w-48" />
                </div>
                <CardHeader className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Campaña Influenza 2024</h1>
                            </div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <Users className="h-3 w-3" /> Población Objetivo: Todos los Colaboradores (NI, CR, HN)
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-6">
                                <Upload className="h-4 w-4 mr-2" /> Importar Excel
                            </Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-6 shadow-xl shadow-emerald-900/40">
                                <Zap className="h-4 w-4 mr-2" /> Exportar Reporte
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-0">
                    <div className="flex flex-wrap gap-8 items-center border-t border-white/10 pt-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Progreso General</p>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                                     <div className="h-full bg-emerald-500" style={{ width: '45%' }} />
                                </div>
                                <span className="text-xl font-black italic">45%</span>
                            </div>
                        </div>
                        <div className="space-y-1 pr-8 border-r border-white/10">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Registrados</p>
                            <h4 className="text-xl font-black italic leading-none mt-1">1,240</h4>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Meta Campaña</p>
                            <h4 className="text-xl font-black italic leading-none mt-1">2,750</h4>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Listado / Buscador */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <CardTitle className="text-slate-900 font-black italic uppercase tracking-tight text-xl">Registro de Resultados</CardTitle>
                            <CardDescription className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Búsqueda y Actualización por Carnet o Nombre</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                            <Input 
                                placeholder="Buscar colaborador..." 
                                className="pl-10 rounded-2xl border-slate-200 bg-slate-50 font-bold text-sm h-11 focus:ring-slate-900 focus:border-slate-900" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="font-black uppercase text-[10px] tracking-widest py-4 pl-8">Colaborador</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Gerencia</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Gestión / Acción</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Resultado / Dosis</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Acciones Rápidas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((c) => (
                                <TableRow key={c.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 cursor-pointer group">
                                    <TableCell className="py-5 pl-8">
                                        <div className="space-y-0.5">
                                            <p className="font-black italic text-slate-900 uppercase text-sm tracking-tight">{c.nombre}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{c.carnet}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-xs text-slate-600 uppercase">{c.gerencia}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge 
                                            variant={c.estado === 'VACUNADO' || c.estado === 'COMPLETADO' ? 'default' : c.estado === 'EXENTADO' ? 'secondary' : 'outline'}
                                            className={cn(
                                                "font-black uppercase text-[9px] px-3 py-1 rounded-full",
                                                (c.estado === 'VACUNADO' || c.estado === 'COMPLETADO') ? "bg-emerald-500 hover:bg-emerald-600" : "opacity-60"
                                            )}
                                        >
                                            {c.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-900 italic">{c.dosis}</p>
                                            <p className="text-[9px] font-bold text-slate-400">{c.fecha}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            {c.estado === 'PENDIENTE' ? (
                                                <>
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleVacunar(c.id)}
                                                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-[9px] tracking-widest h-8"
                                                    >
                                                        <UserCheck className="h-3 w-3 mr-1.5" /> Registrar
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="rounded-xl font-black uppercase text-[9px] tracking-widest h-8"
                                                    >
                                                        <FileText className="h-3 w-3 mr-1.5" /> Cargar Resultado
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button 
                                                   variant="ghost" 
                                                   className="rounded-xl h-8 px-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                   onClick={() => handleExentar(c.id)}
                                                >
                                                    <UserX className="h-3 w-3" /> Anular
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
