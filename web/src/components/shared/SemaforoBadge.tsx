import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface SemaforoBadgeProps {
  nivel: 'V' | 'A' | 'R' | string | null | undefined;
  className?: string;
}

const statusConfig = {
    V: { 
      text: "Normal", 
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      dotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
    },
    A: { 
      text: "Moderado", 
      className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      dotClass: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
    },
    R: { 
      text: "Crítico", 
      className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 animate-pulse",
      dotClass: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
    },
};

export function SemaforoBadge({ nivel, className }: SemaforoBadgeProps) {
  if (!nivel) {
    return (
      <Badge variant="outline" className={cn("font-bold px-3 py-1 bg-slate-100 text-slate-500 border-slate-200", className)}>
        N/A
      </Badge>
    );
  }

  const config = statusConfig[nivel as keyof typeof statusConfig] || { 
    text: nivel, 
    className: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400"
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-bold px-3 py-1 transition-all duration-300 gap-2 border shadow-sm uppercase text-[10px] tracking-wider", 
        config.className, 
        className
      )}
    >
      <div className={cn("h-2 w-2 rounded-full", config.dotClass)} />
      {config.text}
    </Badge>
  );
}
