import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ClipboardList,
  UserCircle,
  FileText,
  BarChart3,
  ShieldCheck,
  Stethoscope,
  Activity,
  UserCog,
  History
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface SidebarItemProps {
  icon: any;
  label: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, path, isActive, isCollapsed, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full p-3 rounded-xl transition-all duration-300 group mb-1.5",
      isActive 
        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
        : "text-slate-600 hover:bg-slate-100 hover:text-primary"
    )}
  >
    <Icon className={cn("h-5 w-5 min-w-[20px] transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
    {!isCollapsed && <span className="ml-3 font-bold text-xs uppercase tracking-wider truncate">{label}</span>}
  </button>
);

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.rol || 'PACIENTE';

  // Configuración de menús por Rol
  const menuConfig: Record<string, { icon: any, label: string, path: string }[]> = {
    MEDICO: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/medico/dashboard' },
      { icon: Calendar, label: 'Agenda Diaria', path: '/medico/agenda-citas' },
      { icon: ShieldCheck, label: 'Gestión Campañas', path: '/medico/campanas' },
      { icon: Users, label: 'Mis Pacientes', path: '/medico/pacientes' },
      { icon: ClipboardList, label: 'Historial Clínico', path: '/medico/historial' },
    ],
    ADMIN: [
      { icon: BarChart3, label: 'Métricas Globales', path: '/admin/dashboard' },
      { icon: UserCog, label: 'Gestión Médica', path: '/admin/medicos' },
      { icon: Users, label: 'Censo de Pacientes', path: '/admin/pacientes' },
      { icon: Activity, label: 'Reportes Epidemiol.', path: '/admin/reportes' },
      { icon: ShieldCheck, label: 'Auditoría SSO', path: '/admin/auditoria' },
    ],
    PACIENTE: [
      { icon: LayoutDashboard, label: 'Mi Panel Salud', path: '/paciente/dashboard' },
      { icon: FileText, label: 'Mis Resultados', path: '/paciente/resultados' },
      { icon: Stethoscope, label: 'Telemedicina', path: '/paciente/telemedicina' },
      { icon: History, label: 'Mi Historial', path: '/paciente/historial' },
    ]
  };

  const menuItems = menuConfig[role] || menuConfig.PACIENTE;

  return (
    <aside 
      className={cn(
        "flex flex-col bg-white border-r h-screen sticky top-0 transition-all duration-500 ease-in-out z-40 shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b h-20 bg-slate-50/30">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="font-black text-lg text-slate-900 tracking-tighter leading-none italic">Clinic<span className="text-primary NOT-italic font-black">Portal</span></span>
                <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Enterprise</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto bg-primary text-white p-2 rounded-xl">
             <Activity className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 mt-6">
        <div className="mb-4 ml-2">
            {!collapsed && <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Menú Principal</span>}
        </div>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            isActive={location.pathname.startsWith(item.path)}
            isCollapsed={collapsed}
            onClick={() => navigate(item.path)}
          />
        ))}

        <div className="mt-8">
            <SidebarItem
                icon={Settings}
                label="Preferencias"
                path="/configuracion"
                isActive={location.pathname.startsWith("/configuracion")}
                isCollapsed={collapsed}
                onClick={() => navigate("/configuracion")}
            />
        </div>
      </div>

      {/* Navigation Toggle Button (Floating style) */}
      <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 bg-white border rounded-full h-6 w-6 flex items-center justify-center shadow-md hover:text-primary transition-colors text-slate-400 group"
      >
          {collapsed ? <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" /> : <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />}
      </button>

      {/* User Footer with Role Switcher (Practical & Modern) */}
      <div className="p-4 border-t bg-slate-50/80">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-2xl cursor-pointer hover:bg-white transition-all duration-300",
                    collapsed ? "justify-center" : "justify-between"
                )}>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 border-2 border-white shadow-sm flex items-center justify-center">
                            <UserCircle className="text-slate-500 h-8 w-8" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col items-start min-w-0">
                                <span className="text-[11px] font-black text-slate-800 truncate leading-tight w-28 uppercase tracking-tighter">{user?.nombre_completo || 'Usuario'}</span>
                                <div className="flex items-center gap-1">
                                    <div className={cn("h-1.5 w-1.5 rounded-full", role === 'ADMIN' ? "bg-indigo-500" : role === 'MEDICO' ? "bg-emerald-500" : "bg-primary")} />
                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{role}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {!collapsed && <ChevronRight size={12} className="text-slate-300 shrink-0" />}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2 rounded-2xl p-2 shadow-2xl border-slate-100">
                <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-2">Cambiar Perfil</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => switchRole('MEDICO')} className="rounded-xl p-2 cursor-pointer gap-2">
                    <Stethoscope className="h-4 w-4 text-emerald-500" />
                    <span className="font-bold text-xs uppercase">Modo Médico</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole('ADMIN')} className="rounded-xl p-2 cursor-pointer gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-500" />
                    <span className="font-bold text-xs uppercase">Modo Administrador</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole('PACIENTE')} className="rounded-xl p-2 cursor-pointer gap-2">
                    <UserCircle className="h-4 w-4 text-rose-500" />
                    <span className="font-bold text-xs uppercase">Modo Paciente</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={logout} className="rounded-xl p-2 cursor-pointer gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                    <LogOut className="h-4 w-4" />
                    <span className="font-black text-xs uppercase tracking-widest">Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
