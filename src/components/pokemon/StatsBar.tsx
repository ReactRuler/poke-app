'use client';

import type { Stat } from '@/types/pokemon';

interface Props {
  stats: Stat[];
}

const STAT_MAX = 255;

function colorStat(valor: number): string {
  if (valor >= 100) return 'bg-green-500';
  if (valor >= 60) return 'bg-yellow-400';
  return 'bg-red-400';
}

// Barras de estadísticas base; el máximo de referencia es 255 (Blissey).
export function StatsBar({ stats }: Props) {
  return (
    <div className="space-y-2">
      {stats.map(stat => (
        <div key={stat.nombre} className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 w-20 shrink-0 text-right">
            {stat.nombre}
          </span>
          <span className="text-sm font-bold text-gray-700 w-8 shrink-0">
            {stat.valor}
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`${colorStat(stat.valor)} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${(stat.valor / STAT_MAX) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
