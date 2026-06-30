'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { EslabonEvolutivo } from '@/types/pokemon';
import { capitalizar } from '@/lib/utils';

interface Props {
  cadena: EslabonEvolutivo[];
  idActual: number;
}

// Enlaces de evolución abren el modal (?pokemon=ID) sin recargar el listado.
export function EvolutionChain({ cadena, idActual }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {cadena.map((eslabon, indice) => (
        <div key={eslabon.id} className="flex items-center gap-2">
          {indice > 0 && (
            <span className="text-gray-400 text-2xl">→</span>
          )}

          <Link
            href={`/?pokemon=${eslabon.id}`}
            scroll={false}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 cursor-pointer
              ${eslabon.id === idActual
                ? 'bg-red-100 ring-2 ring-red-500 scale-105'
                : 'hover:bg-gray-100'
              }
            `}
          >
            <Image
              src={eslabon.imagen}
              alt={`Imagen de ${eslabon.nombre}`}
              width={72}
              height={72}
              unoptimized
              className="drop-shadow-sm"
            />
            <span className="text-xs font-medium text-gray-700 capitalize">
              {capitalizar(eslabon.nombre)}
            </span>
            {eslabon.id === idActual && (
              <span className="text-xs text-red-500 font-semibold">Actual</span>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
