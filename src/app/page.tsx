'use client';

import { Suspense } from 'react';
import { usePokemonList } from '@/hooks/usePokemonList';
import { useEvolutionMap } from '@/hooks/useEvolutionMap';
import { useFilteredPokemon } from '@/hooks/useFilteredPokemon';
import { PokemonSearch } from '@/components/pokemon/PokemonSearch';
import { PokemonFilters } from '@/components/pokemon/PokemonFilters';
import { PokemonGrid } from '@/components/pokemon/PokemonGrid';
import { PokemonModalFromUrl } from '@/components/pokemon/PokemonModalFromUrl';
import { Spinner } from '@/components/ui/Spinner';
import { useListadoStore } from '@/store/listingStore';

function ListadoContenido() {
  const { data: listado = [], isLoading, isError, isFetching } = usePokemonList();
  const mapaFamilias = useEvolutionMap();
  const pokemonFiltrados = useFilteredPokemon(listado, mapaFamilias);
  const { resetearFiltros, busqueda, filtroPorTipo, filtroPorGeneracion, soloFavoritos, soloVistos } =
    useListadoStore();

  const claveFiltros = `${busqueda}|${filtroPorTipo}|${filtroPorGeneracion ?? ''}|${soloFavoritos}|${soloVistos}`;

  const mostrarSpinner = isLoading && listado.length === 0;

  if (mostrarSpinner) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner />
        <p className="text-gray-500">Cargando Pokédex...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500 text-lg">Error al cargar los Pokémon.</p>
        <p className="text-gray-400 text-sm mt-2">Comprueba tu conexión e intenta de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <PokemonSearch />
        <PokemonFilters />
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <p className="text-sm text-gray-500">
          {pokemonFiltrados.length} Pokémon encontrados de {listado.length}
          {isFetching && listado.length > 0 && (
            <span className="ml-2 text-gray-400">actualizando...</span>
          )}
        </p>
        <button
          onClick={resetearFiltros}
          className="text-sm text-red-500 hover:underline cursor-pointer"
        >
          Limpiar filtros
        </button>
      </div>

      <PokemonGrid pokemon={pokemonFiltrados} claveFiltros={claveFiltros} />
    </div>
  );
}

export default function PaginaPrincipal() {
  return (
    <>
      <ListadoContenido />
      <Suspense fallback={null}>
        <PokemonModalFromUrl />
      </Suspense>
    </>
  );
}
