import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SemaforoBadge } from "@/components/shared/SemaforoBadge";
import { CitaMedica } from '@/lib/types/domain';
import { cn } from '@/lib/utils';

export function AgendaCitas() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'HOY' | 'MANANA' | 'TODOS'>('HOY');
  const [isNewCitaOpen, setIsNewCitaOpen] = useState(false);

  // MOCK DATA for appointments
  const mockCitas: CitaMedica[] = [
    {
        id: 101,
        idCaso: 456,
        idPaciente: 1,
        idMedico: 1,
        fechaCita: new Date().toISOString(),
        horaCita: "08:30",
        canalOrigen: "Portal WEB",
        estadoCita: 'CONFIRMADA' as any,
        motivoResumen: "Control de diabetes y revisión de laboratorio.",
        nivelSemaforoPaciente: 'V' as any,
        paciente_nombre: "Juan Pérez",
        paciente_carnet: "12345678"
    },
    {
        id: 102,
        idCaso: 457,
        idPaciente: 2,
        idMedico: 1,
        fechaCita: new Date().toISOString(),
        horaCita: "09:30",
        canalOrigen: "APP Móvil",
        estadoCita: 'PROGRAMADA' as any,
        motivoResumen: "Dolor lumbar crónico.",
        nivelSemaforoPaciente: 'A' as any,
        paciente_nombre: "María Rodríguez",
        paciente_carnet: "87654321"
    },
    {
        id: 103,
        idCaso: 458,
        idPaciente: 3,
        idMedico: 1,
        fechaCita: new Date().toISOString(),
        horaCita: "10:00",
        canalOrigen: "Presencial",
        estadoCita: 'EN_ATENCION' as any,
        motivoResumen: "Fiebre persistente y escalofríos.",
        nivelSemaforoPaciente: 'R' as any,
        paciente_nombre: "Carlos Gómez",
        paciente_carnet: "11223344"
    },
    {
        id: 104,
        idCaso: 459,
        idPaciente: 4,
        idMedico: 1,
        fechaCita: new Date().toISOString(),
        horaCita: "11:30",
        canalOrigen: "Telemedicina",
        estadoCita: 'PROGRAMADA' as any,
        motivoResumen: "Revisión de resultados de rayos X.",
        nivelSemaforoPaciente: 'V' as any,
        paciente_nombre: "Ana Martínez",
        paciente_carnet: "55667788"
    }
  ] as any[];

  const filteredCitas = useMemo(() => {
    return mockCitas.filter(cita => 
        (cita.paciente_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         cita.paciente_carnet?.includes(searchQuery))
    );
  }, [searchQuery, mockCitas]);

  const stats = {
    total: mockCitas.length,
    atendidas: 1,
    pendientes: 3,
    urgentes: 1
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Agenda Médica</h1>
          <p className="text-slate-500 font-medium">Gestiona tus consultas programadas para hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200">
             <CalendarIcon size={16} /> 18 de Marzo, 2026
          </Button>
          <Dialog open={isNewCitaOpen} onOpenChange={setIsNewCitaOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 gap-2 shadow-sm">
                    <Plus size={18} /> Nueva Cita
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden bg-white p-0">
                <DialogHeader className="bg-slate-900 text-white p-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-3 rounded-2xl">
                            <CalendarIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">Nueva Cita</DialogTitle>
                            <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Programar nueva atención médica</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Carnet del Paciente / Colaborador</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Escriba el carnet..." className="pl-10 h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold text-slate-900 focus:ring-primary" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Fecha</Label>
                            <Input type="date" className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Hora</Label>
                            <Input type="time" className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold" />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Motivo de la Consulta</Label>
                         <Input placeholder="Ej: Control cardiovascular..." className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-medium" />
                    </div>
                </div>
                <DialogFooter className="p-8 bg-slate-50 border-t flex flex-row gap-3">
                    <Button variant="ghost" onClick={() => setIsNewCitaOpen(false)} className="flex-1 h-12 rounded-2xl font-black italic uppercase italic">Cancelar</Button>
                    <Button className="flex-1 h-12 rounded-2xl bg-primary text-white font-black italic uppercase tracking-wider italic shadow-lg shadow-primary/20 hover:scale-105 transition-all">AGENDAR AHORA</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Citas Totales', value: stats.total, icon: CalendarIcon, color: 'text-primary bg-primary/10' },
           { label: 'En Espera', value: stats.pendientes, icon: Clock, color: 'text-amber-600 bg-amber-50' },
           { label: 'Atendidas', value: stats.atendidas, icon: User, color: 'text-green-600 bg-green-50' },
           { label: 'Críticos/Urgentes', value: stats.urgentes, icon: Plus, color: 'text-red-600 bg-red-50' }
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
             <CardContent className="p-4 flex items-center gap-4">
               <div className={`p-3 rounded-xl ${stat.color}`}>
                 <stat.icon size={22} />
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                 <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
               </div>
             </CardContent>
           </Card>
         ))}
      </div>

      {/* Table & Filters */}
      <Card className="border-none shadow-md overflow-hidden bg-white">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg self-start">
               {['HOY', 'MANANA', 'TODOS'].map((f) => (
                 <button
                    key={f}
                    onClick={() => setActiveFilter(f as any)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                        activeFilter === f ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                 >
                   {f}
                 </button>
               ))}
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                   placeholder="Buscar por nombre o carnet..." 
                   className="pl-10 h-10 border-slate-200"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200">
                 <Filter size={18} className="text-slate-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-20 pl-6 h-12 text-slate-500 font-bold uppercase text-[10px]">Hora</TableHead>
                <TableHead className="h-12 text-slate-500 font-bold uppercase text-[10px]">Paciente</TableHead>
                <TableHead className="h-12 text-slate-500 font-bold uppercase text-[10px]">Estado</TableHead>
                <TableHead className="h-12 text-slate-500 font-bold uppercase text-[10px] hidden md:table-cell">Motivo</TableHead>
                <TableHead className="h-12 text-slate-500 font-bold uppercase text-[10px] text-center">Triaje</TableHead>
                <TableHead className="w-24 pr-6 h-12 text-slate-500 font-bold uppercase text-[10px] text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCitas.length > 0 ? (
                filteredCitas.map((cita) => (
                  <TableRow key={cita.id} className="hover:bg-slate-50 transition-colors border-b">
                    <TableCell className="pl-6 font-bold text-slate-900 border-r border-slate-50">{cita.horaCita}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{cita.paciente_nombre}</span>
                        <span className="text-xs text-slate-400 font-medium">#{cita.paciente_carnet}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border-none",
                          cita.estadoCita === 'EN_ATENCION' ? "bg-primary text-white" :
                          cita.estadoCita === 'CONFIRMADA' ? "bg-green-100 text-green-700 hover:bg-green-200" :
                          "bg-slate-100 text-slate-600"
                        )}
                      >
                        {cita.estadoCita?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        <p className="text-xs text-slate-500 max-w-[200px] truncate font-medium">{cita.motivoResumen}</p>
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex justify-center">
                           <SemaforoBadge nivel={cita.nivelSemaforoPaciente as any} />
                        </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                       <Button 
                         variant="default" 
                         size="sm" 
                         className="h-8 font-bold text-[11px] px-4 rounded-md shadow-sm bg-primary hover:bg-primary/90"
                         onClick={() => navigate(`/medico/atencion/${cita.id}`)}
                       >
                         ATENDER
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium italic">
                     No se encontraron citas con los criterios de búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="p-4 flex items-center justify-between border-t text-sm font-medium text-slate-500 bg-slate-50/30">
             <span>Mostrando {filteredCitas.length} citas filtradas</span>
             <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ChevronLeft size={16}/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-900 bg-white shadow-sm border">1</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><ChevronRight size={16}/></Button>
             </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Legend / Tips */}
      <div className="flex gap-6 items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
         <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Leyenda de Triaje:</p>
         <div className="flex gap-4">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-green-100" /> <span className="text-[10px] font-bold text-slate-600 uppercase">Estable</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100" /> <span className="text-[10px] font-bold text-slate-600 uppercase">Moderado</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100" /> <span className="text-[10px] font-bold text-slate-600 uppercase">Grave</span></div>
         </div>
         <div className="ml-auto hidden sm:block">
            <span className="text-[10px] font-medium text-slate-400">Seleccione "Atender" para iniciar el wizard de consulta médica.</span>
         </div>
      </div>
    </div>
  );
}
