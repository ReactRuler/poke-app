'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDetalleLocal } from '@/lib/pokemon-data';
import type { PokemonDetalle } from '@/types/pokemon';

// Carga la ficha de un Pokémon desde public/data/detalles/{id}.json
export function usePokemonDetail(id: number) {
  return useQuery<PokemonDetalle>({
    queryKey: ['pokemon', 'detalle', id],
    queryFn: () => fetchDetalleLocal(id),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
