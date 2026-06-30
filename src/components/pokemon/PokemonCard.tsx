'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { PokemonListItem } from '@/types/pokemon';
import { Badge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { formatearId, capitalizar, COLORES_TIPO, NOMBRES_TIPOS_ES } from '@/lib/utils';
import { useUserProgressStore } from '@/store/userProgressStore';

interface Props {
  pokemon: PokemonListItem;
}

// Tarjeta del listado: abre modal vía ?pokemon=ID sin desmontar el listado.
export function PokemonCard({ pokemon }: Props) {
  const router = useRouter();
  const esVisto = useUserProgressStore(s => s.esVisto(pokemon.id));
  const esFavorito = useUserProgressStore(s => s.esFavorito(pokemon.id));
  const marcarVisto = useUserProgressStore(s => s.marcarVisto);

  const colorFondo = COLORES_TIPO[pokemon.tipos[0]]?.replace('text-white', '').replace('text-black', '').replace('bg-', 'bg-opacity-20 bg-') ?? 'bg-gray-100';

  const abrirFicha = () => {
    marcarVisto(pokemon.id);
    router.push(`/?pokemon=${pokemon.id}`, { scroll: false });
  };

  const clasesTarjeta = [
    'group relative flex h-full flex-col rounded-2xl bg-white border transition-all duration-200 cursor-pointer',
    esFavorito
      ? 'border-amber-300 shadow-md shadow-amber-100/80 ring-2 ring-amber-200'
      : 'border-gray-200 shadow-sm',
    esVisto && !esFavorito
      ? 'ring-2 ring-slate-300/70 shadow-[inset_0_2px_8px_rgba(148,163,184,0.15)]'
      : '',
    esVisto && esFavorito
      ? 'shadow-[inset_0_2px_8px_rgba(148,163,184,0.12)]'
      : '',
    'hover:shadow-lg hover:-translate-y-1',
  ].join(' ');

  return (
    <div className="relative h-full">
      {esVisto && (
        <span className="absolute bottom-3 right-3 z-10 rounded-full bg-slate-600/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white pointer-events-none">
          Visto
        </span>
      )}

      <Link
        href={`/?pokemon=${pokemon.id}`}
        scroll={false}
        onClick={(e) => {
          e.preventDefault();
          abrirFicha();
        }}
        className={clasesTarjeta}
      >
        <div className={`${colorFondo} aspect-square rounded-t-2xl flex flex-col ${esVisto ? 'opacity-95' : ''}`}>
          <div className="flex shrink-0 items-center justify-between px-3 pt-3">
            <FavoriteButton id={pokemon.id} variant="overlay" size="md" />
            <span className="text-xs font-mono text-white font-semibold drop-shadow-md">
              {formatearId(pokemon.id)}
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center px-3 pb-3 min-h-0">
          <Image
            src={pokemon.imagen}
            alt={`Imagen de ${pokemon.nombre}`}
            width={110}
            height={110}
            className="drop-shadow-md group-hover:scale-105 transition-transform duration-200"
            unoptimized
          />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 p-3">
          <h2 className="font-semibold text-gray-800 text-sm capitalize leading-tight">
            {capitalizar(pokemon.nombre)}
          </h2>

          <div className="flex gap-1.5 flex-wrap">
            {pokemon.tipos.map(tipo => (
              <Badge key={tipo} className={COLORES_TIPO[tipo]}>
                {NOMBRES_TIPOS_ES[tipo] ?? tipo}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-gray-400">{pokemon.nombreGeneracion}</p>
        </div>
      </Link>
    </div>
  );
}
