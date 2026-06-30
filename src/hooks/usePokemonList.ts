'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchListadoLocal } from '@/lib/pokemon-data';
import type { PokemonListItem } from '@/types/pokemon';

const CLAVE_LISTADO = ['pokemon', 'listado-completo'];

// Carga el listado desde caché local (public/data/listado.json).
export function usePokemonList() {
  return useQuery<PokemonListItem[]>({
    queryKey: CLAVE_LISTADO,
    queryFn: fetchListadoLocal,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
