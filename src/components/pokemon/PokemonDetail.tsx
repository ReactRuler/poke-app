'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { PokemonDetalle } from '@/types/pokemon';
import { EvolutionChain } from '@/components/pokemon/EvolutionChain';
import { StatsBar } from '@/components/pokemon/StatsBar';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { useUserProgressStore } from '@/store/userProgressStore';
import { capitalizar, formatearId, COLORES_TIPO, NOMBRES_TIPOS_ES } from '@/lib/utils';

interface Props {
  pokemon: PokemonDetalle;
  variant?: 'modal' | 'page';
  onClose?: () => void;
}

export function PokemonDetail({ pokemon, variant = 'page', onClose }: Props) {
  const marcarVisto = useUserProgressStore(s => s.marcarVisto);
  const esFavorito = useUserProgressStore(s => s.esFavorito(pokemon.id));

  useEffect(() => {
    marcarVisto(pokemon.id);
  }, [pokemon.id, marcarVisto]);

  const colorBanner = COLORES_TIPO[pokemon.tipos[0]]
    ?.replace('text-white', '')
    .replace('text-black', '') ?? 'bg-gray-100';

  return (
    <div className={`max-w-3xl mx-auto space-y-8 ${variant === 'modal' ? 'pb-4' : ''}`}>
      <div className="flex items-center justify-between gap-4">
        <BackButton onClick={variant === 'modal' ? onClose : undefined} />
      </div>

      <div className={`bg-white rounded-3xl shadow-md overflow-hidden ${esFavorito ? 'ring-2 ring-amber-200' : ''}`}>
        <div className={`${colorBanner} px-8 pt-6 pb-8 flex flex-col items-center gap-2`}>
          <div className="w-full flex justify-end">
            <FavoriteButton id={pokemon.id} variant="banner" size="lg" />
          </div>
          <span className="text-sm font-mono text-white font-semibold drop-shadow-md">{formatearId(pokemon.id)}</span>
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {capitalizar(pokemon.nombre)}
          </h1>
          <div className="flex gap-2">
            {pokemon.tipos.map(tipo => (
              <Badge key={tipo} className={COLORES_TIPO[tipo]}>
                {NOMBRES_TIPOS_ES[tipo] ?? tipo}
              </Badge>
            ))}
          </div>
          <Image
            src={pokemon.imagen}
            alt={`Imagen oficial de ${pokemon.nombre}`}
            width={200}
            height={200}
            unoptimized
            className="drop-shadow-xl"
            priority
          />
        </div>

        <div className="p-6 space-y-6">
          {pokemon.descripcion && (
            <p className="text-gray-600 text-sm leading-relaxed italic">
              &ldquo;{pokemon.descripcion}&rdquo;
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Generación</p>
              <p className="font-semibold text-gray-700">{pokemon.nombreGeneracion}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Altura</p>
              <p className="font-semibold text-gray-700">{(pokemon.altura / 10).toFixed(1)} m</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Peso</p>
              <p className="font-semibold text-gray-700">{(pokemon.peso / 10).toFixed(1)} kg</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Habilidades</p>
              <p className="font-semibold text-gray-700 capitalize text-xs">
                {pokemon.habilidades.map(capitalizar).join(', ')}
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-bold text-gray-700 mb-3">Estadísticas base</h2>
            <StatsBar stats={pokemon.stats} />
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-700 mb-3">Cadena evolutiva</h2>
            {pokemon.cadenaEvolutiva.length <= 1 ? (
              <p className="text-sm text-gray-400">Este Pokémon no evoluciona.</p>
            ) : (
              <EvolutionChain cadena={pokemon.cadenaEvolutiva} idActual={pokemon.id} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
