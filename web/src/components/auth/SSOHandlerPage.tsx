import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { APP_BASE, PORTAL_URL } from '@/lib/runtime';

export function SSOHandlerPage() {
  const [searchParams] = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);
  const [carnetInput, setCarnetInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const getDashboardUrl = (rol: string) => {
    switch (rol) {
      case 'PACIENTE': return '/paciente/dashboard';
      case 'MEDICO': return '/medico/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/login';
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const token = searchParams.get('token');

    if (!token) {
      window.location.href = PORTAL_URL;
      return;
    }

    const performSSO = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sso-login`, {
          signal: abortController.signal,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          throw new Error('SSO Authentication failed');
        }

        const data = await response.json();
        const { access_token, user: userData } = data;

        if (access_token && userData) {
          localStorage.setItem('token', access_token);
          localStorage.setItem('user', JSON.stringify(userData));
          const base = APP_BASE === '/' ? '' : APP_BASE.replace(/\/$/, '');
          window.location.replace(`${base}${getDashboardUrl(userData.rol)}`);
        } else {
          throw new Error('Respuesta SSO inválida');
        }
      } catch (error) {
        console.error('SSO Error:', error);
        setShowLogin(true);
      }
    };

    performSSO();
    return () => abortController.abort();
  }, [searchParams]);

  const handleDirectLogin = async () => {
    if (!carnetInput.trim()) return;
    setErrorMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carnet: carnetInput.trim(), password: 'Temporal123!' })
      });
      const data = await res.json();
      if (!data.access_token) {
        setErrorMsg('Credenciales inválidas');
        return;
      }
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const base = APP_BASE === '/' ? '' : APP_BASE.replace(/\/$/, '');
      window.location.replace(`${base}${getDashboardUrl(data.user.rol)}`);
    } catch {
      setErrorMsg('Error de conexión al servidor');
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full mx-4">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Acceso Directo</h2>
          <p className="text-sm text-slate-500 mb-4">El SSO no está disponible. Ingresa tu carnet para acceder.</p>
          {errorMsg && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-3">{errorMsg}</div>}
          <input
            value={carnetInput}
            onChange={e => setCarnetInput(e.target.value)}
            placeholder="Tu carnet (ej: 500708)"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3"
          />
          <button
            onClick={handleDirectLogin}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
          >
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <h2 className="text-xl font-semibold text-slate-700">Autenticando con Portal Central...</h2>
        <p className="text-slate-500">Espera un momento, estamos preparando tu sesión.</p>
      </div>
    </div>
  );
}
