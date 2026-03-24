import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Home, Calendar, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-primary text-white p-1.5 rounded-lg mr-2">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Clínica Portal</span>
            </div>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <button
                onClick={() => navigate('/medico/agenda-citas')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/medico/agenda-citas') 
                    ? 'border-primary text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Mi Agenda
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-gray-900">{user.nombre_completo}</span>
              <span className="text-xs text-gray-500">{user.rol}</span>
            </div>
            
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="h-5 w-5 text-gray-600" />
            </div>

            <Button variant="ghost" size="icon" onClick={logout} title="Cerrar Sesión">
              <LogOut className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
