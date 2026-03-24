import { useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ChevronRight, Home } from 'lucide-react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
         {/* Top bar search / notifications if needed */}
         <div className="h-16 bg-white border-b sticky top-0 z-30 flex items-center px-8 shadow-sm justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
               <Home className="h-4 w-4" />
               <ChevronRight className="h-3 w-3" />
               {pathnames.map((name, index) => {
                 const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                 const isLast = index === pathnames.length - 1;
                 const cleanName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                 
                 return isLast ? (
                   <span key={name} className="text-primary font-bold">{cleanName}</span>
                 ) : (
                   <span key={name} className="flex items-center gap-2">
                     <Link to={routeTo} className="hover:text-slate-600 transition-colors uppercase tracking-widest">{cleanName}</Link>
                     <ChevronRight className="h-3 w-3" />
                   </span>
                 );
               })}
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xs w-full cursor-pointer hover:border-primary/30 group">
                <span className="text-xs font-semibold mr-auto">Realizar búsqueda rápida...</span>
                <span className="text-[10px] border px-1.5 py-0.5 rounded-md bg-white text-slate-400 group-hover:text-primary">⌘ K</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center relative">
                    <div className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white absolute -top-0.5 -right-0.5 animate-pulse" />
                    <Home className="h-4 w-4 text-slate-500" />
                </div>
            </div>
         </div>
         
         <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            {children}
         </div>
      </main>
    </div>
  );
}

