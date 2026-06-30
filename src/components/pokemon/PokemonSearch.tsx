'use client';

import { useListadoStore } from '@/store/listingStore';

// Buscador en tiempo real; el filtrado real ocurre en useFilteredPokemon.
export function PokemonSearch() {
  const { busqueda, setBusqueda } = useListadoStore();

  return (
    <div className="relative">
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre (incluye evoluciones)..."
        className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
      {busqueda && (
        <button
          onClick={() => setBusqueda('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}
