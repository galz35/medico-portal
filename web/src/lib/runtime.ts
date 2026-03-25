/**
 * Centralizador de Rutas y Configuración de Entorno (Clínica)
 */

export const APP_BASE = import.meta.env.VITE_BASE_PATH || "/";

// URL base de la API de Clínica
export const API_BASE = import.meta.env.VITE_API_URL || "/api";

// URL del portal central (para redirecciones de salida)
export const PORTAL_URL = import.meta.env.VITE_PORTAL_URL || "http://localhost:5173";

export function appPath(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${APP_BASE}${cleanPath}`.replace(/\/+/g, '/');
}
