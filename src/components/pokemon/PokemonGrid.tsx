'use client';

import type { PokemonListItem } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';
import { useInfinitePokemon, LOTE_POKEMON } from '@/hooks/useInfinitePokemon';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  pokemon: PokemonListItem[];
  claveFiltros: string;
}

// Grid con scroll infinito: carga 25 Pokémon por lote al hacer scroll.
export function PokemonGrid({ pokemon, claveFiltros }: Props) {
  const { visibles, cargandoMas, hayMas, sentinelRef, cantidadVisible, total } =
    useInfinitePokemon(pokemon, claveFiltros);

  if (pokemon.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No se encontraron Pokémon con estos filtros.</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {visibles.map(p => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      <div ref={sentinelRef} className="flex flex-col items-center justify-center gap-3 pt-8 min-h-[80px]">
        {cargandoMas && <Spinner size="sm" />}
        {hayMas && !cargandoMas && (
          <p className="text-xs text-gray-400">Desplázate para cargar más...</p>
        )}
        {!hayMas && total > LOTE_POKEMON && (
          <p className="text-xs text-gray-400">
            Mostrando los {total} Pokémon
          </p>
        )}
      </div>

      {cantidadVisible < total && !cargandoMas && (
        <p className="text-center text-xs text-gray-400 mt-2">
          {cantidadVisible} de {total} mostrados
        </p>
      )}
    </div>
  );
}
