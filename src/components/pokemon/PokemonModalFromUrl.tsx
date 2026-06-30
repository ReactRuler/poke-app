'use client';

import { useSearchParams } from 'next/navigation';
import { PokemonModal } from '@/components/pokemon/PokemonModal';

// Lee ?pokemon=ID de la URL y muestra el modal si existe.
export function PokemonModalFromUrl() {
  const searchParams = useSearchParams();
  const raw = searchParams.get('pokemon');
  const id = raw ? Number(raw) : NaN;

  if (!raw || Number.isNaN(id) || id <= 0) return null;

  return <PokemonModal key={id} id={id} />;
}
