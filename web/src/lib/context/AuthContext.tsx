import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

// Define the User interface based on what the API returns
export interface User {
  id_usuario: number;
  carnet: string;
  nombre_completo: string;
  correo: string;
  rol: 'PACIENTE' | 'MEDICO' | 'ADMIN';
  pais: string;
  estado: string;
  idPaciente?: number;
  idMedico?: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (carnet: string, pass: string) => Promise<void>;
  logout: () => void;
  pais: string;
  setPais: (pais: string) => void;
  switchRole: (role: 'PACIENTE' | 'MEDICO' | 'ADMIN') => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [pais, setPais] = useState<string>('NI'); // Default to Nicaragua

  useEffect(() => {
    let cancelled = false;

    const bootstrapAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          if (!cancelled) {
            setUser(JSON.parse(storedUser));
          }
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      // Passive SSO Hydration
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/portal-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          const payload = await response.json();
          const { access_token, user: userData } = payload;

          if (access_token && userData) {
            if (!cancelled) {
              localStorage.setItem('token', access_token);
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
            }
          }
        }
      } catch (err) {
        console.warn('Portal session bootstrap failed:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const getDashboardUrl = (rol: string) => {
    switch (rol) {
      case 'PACIENTE': return '/paciente/dashboard';
      case 'MEDICO': return '/medico/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  const login = async (carnet: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { carnet, password: pass });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      const redirectUrl = getDashboardUrl(user.rol);
      navigate(redirectUrl);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const switchRole = async (newRole: 'PACIENTE' | 'MEDICO' | 'ADMIN') => {
    if (user) {
      try {
        const response = await api.get('/auth/profile');
        const realRole = response.data?.rol;
        
        if (realRole === 'ADMIN' || realRole === newRole) {
          const updatedUser = { ...user, rol: newRole };
          setUser(updatedUser);
          const redirectUrl = getDashboardUrl(newRole);
          navigate(redirectUrl);
        } else {
          alert('No tienes permisos en la base de datos para acceder a este rol.');
        }
      } catch (err) {
        console.error('Error verificando permisos', err);
        alert('Error verificando permisos de rol.');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, pais, setPais, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth here as well for convenience, though existing code might use the hook file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
