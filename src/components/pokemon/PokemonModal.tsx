'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePokemonDetail } from '@/hooks/usePokemonDetail';
import { PokemonDetail } from '@/components/pokemon/PokemonDetail';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  id: number;
}

export function PokemonModal({ id }: Props) {
  const router = useRouter();
  const cerrar = useCallback(() => router.replace('/', { scroll: false }), [router]);
  const { data: pokemon, isLoading, isError } = usePokemonDetail(id);

  useEffect(() => {
    document.body.classList.add('modal-abierto');
    return () => document.body.classList.remove('modal-abierto');
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto app-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" />
            <p className="text-gray-500">Cargando Pokémon...</p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-24">
            <p className="text-red-500 text-lg">No se pudo cargar este Pokémon.</p>
            <button
              type="button"
              onClick={cerrar}
              className="mt-4 text-sm text-red-500 hover:underline cursor-pointer"
            >
              ← Volver al listado
            </button>
          </div>
        )}

        {pokemon && !isLoading && (
          <PokemonDetail pokemon={pokemon} onClose={cerrar} variant="modal" />
        )}
      </div>
    </div>
  );
}
