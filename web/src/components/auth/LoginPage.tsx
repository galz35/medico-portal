import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Stethoscope, Lock, User as UserIcon, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, error: authError } = useAuth();
  const [carnet, setCarnet] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carnet || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(carnet, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Portal Clínica</h1>
          <p className="text-slate-500 mt-2">Bienvenido de nuevo, doctor</p>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="h-2 bg-blue-600" />
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {(error || authError) && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertDescription>{error || authError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="carnet">Carnet de Empleado</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="carnet"
                    placeholder="Ej: 123456"
                    className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    value={carnet}
                    onChange={(e) => setCarnet(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
                    ¿Olvidó su contraseña?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  'Ingresar al Sistema'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center space-y-4">
              <p className="text-sm text-slate-500">¿No tiene acceso?</p>
              <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-600 hover:bg-slate-50">
                Contactar a Soporte IT
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-slate-400">
          &copy; 2026 Portal Clínica. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};
