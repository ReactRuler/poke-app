'use client';

import { useListadoStore } from '@/store/listingStore';
import { useUserProgressStore } from '@/store/userProgressStore';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { EyeIcon } from '@/components/ui/EyeIcon';
import { GENERACIONES } from '@/lib/pokeapi';
import { NOMBRES_TIPOS_ES } from '@/lib/utils';

const TIPOS_DISPONIBLES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
  'dragon', 'dark', 'steel', 'fairy',
];

const controlBase =
  'inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm bg-white shadow-sm transition-colors cursor-pointer min-h-[42px]';

const selectClass = `${controlBase} focus:outline-none focus:ring-2 focus:ring-red-400`;

export function PokemonFilters() {
  const {
    filtroPorTipo,
    filtroPorGeneracion,
    soloFavoritos,
    soloVistos,
    setFiltroPorTipo,
    setFiltroPorGeneracion,
    setSoloFavoritos,
    setSoloVistos,
  } = useListadoStore();
  const totalFavoritos = useUserProgressStore(s => s.favoritos.length);
  const totalVistos = useUserProgressStore(s => s.vistos.length);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filtroPorTipo}
        onChange={(e) => setFiltroPorTipo(e.target.value)}
        className={selectClass}
      >
        <option value="">Todos los tipos</option>
        {TIPOS_DISPONIBLES.map(tipo => (
          <option key={tipo} value={tipo}>
            {NOMBRES_TIPOS_ES[tipo] ?? tipo}
          </option>
        ))}
      </select>

      <select
        value={filtroPorGeneracion ?? ''}
        onChange={(e) => setFiltroPorGeneracion(e.target.value ? Number(e.target.value) : null)}
        className={selectClass}
      >
        <option value="">Todas las generaciones</option>
        {GENERACIONES.map(gen => (
          <option key={gen.numero} value={gen.numero}>
            {gen.nombre}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setSoloFavoritos(!soloFavoritos)}
        className={`${controlBase} ${
          soloFavoritos
            ? 'border-red-300 bg-red-50 text-red-700 ring-2 ring-red-100'
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <HeartIcon
          className={`w-5 h-5 shrink-0 ${soloFavoritos ? 'text-red-500' : 'text-gray-400'}`}
          filled={soloFavoritos}
        />
        Solo favoritos {totalFavoritos > 0 && `(${totalFavoritos})`}
      </button>

      <button
        type="button"
        onClick={() => setSoloVistos(!soloVistos)}
        className={`${controlBase} ${
          soloVistos
            ? 'border-slate-400 bg-slate-50 text-slate-700 ring-2 ring-slate-100'
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <EyeIcon
          className={`w-5 h-5 shrink-0 ${soloVistos ? 'text-slate-600' : 'text-gray-400'}`}
        />
        Solo vistos {totalVistos > 0 && `(${totalVistos})`}
      </button>
    </div>
  );
}
