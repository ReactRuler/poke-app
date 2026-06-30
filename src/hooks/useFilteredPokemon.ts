'use client';

import { useMemo } from 'react';
import { useListadoStore } from '@/store/listingStore';
import { useUserProgressStore } from '@/store/userProgressStore';
import type { PokemonListItem } from '@/types/pokemon';

// Aplica búsqueda, filtros y favoritos sobre el listado completo.
export function useFilteredPokemon(
  listado: PokemonListItem[],
  mapaFamilias: Map<string, string[]>
) {
  const { busqueda, filtroPorTipo, filtroPorGeneracion, soloFavoritos, soloVistos } = useListadoStore();
  const favoritos = useUserProgressStore(s => s.favoritos);
  const vistos = useUserProgressStore(s => s.vistos);

  return useMemo(() => {
    let resultado = listado;

    if (filtroPorTipo) {
      resultado = resultado.filter(p => p.tipos.includes(filtroPorTipo));
    }

    if (filtroPorGeneracion !== null) {
      resultado = resultado.filter(p => p.generacion === filtroPorGeneracion);
    }

    if (soloFavoritos) {
      const setFavoritos = new Set(favoritos);
      resultado = resultado.filter(p => setFavoritos.has(p.id));
    }

    if (soloVistos) {
      const setVistos = new Set(vistos);
      resultado = resultado.filter(p => setVistos.has(p.id));
    }

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase().trim();

      const coincidenciasDirectas = listado
        .filter(p => p.nombre.includes(termino))
        .map(p => p.nombre);

      const nombresExpandidos = new Set<string>();
      for (const nombre of coincidenciasDirectas) {
        const familia = mapaFamilias.get(nombre) ?? [nombre];
        for (const miembro of familia) {
          nombresExpandidos.add(miembro);
        }
      }

      resultado = resultado.filter(p => nombresExpandidos.has(p.nombre));
    }

    return resultado;
  }, [listado, busqueda, filtroPorTipo, filtroPorGeneracion, soloFavoritos, soloVistos, favoritos, vistos, mapaFamilias]);
}
