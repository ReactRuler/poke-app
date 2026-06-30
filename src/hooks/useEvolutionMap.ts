'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMapaEvolucionesLocal } from '@/lib/pokemon-data';

// Mapa nombre → familia evolutiva completa, precalculado en la sincronización local.
export function useEvolutionMap(): Map<string, string[]> {
  const { data } = useQuery<Map<string, string[]>>({
    queryKey: ['pokemon', 'mapa-evoluciones'],
    queryFn: fetchMapaEvolucionesLocal,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return data ?? new Map();
}
