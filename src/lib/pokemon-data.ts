import type { PokemonListItem, PokemonDetalle } from '@/types/pokemon';

// Cliente de lectura sobre archivos JSON locales generados por ensure-data.

async function fetchLocal<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se encontraron datos locales: ${url}`);
  return res.json() as Promise<T>;
}

export function obtenerImagenLocal(id: number): string {
  return `/pokemon/${id}.png`;
}

export async function fetchListadoLocal(): Promise<PokemonListItem[]> {
  return fetchLocal<PokemonListItem[]>('/data/listado.json');
}

export async function fetchDetalleLocal(id: number): Promise<PokemonDetalle> {
  return fetchLocal<PokemonDetalle>(`/data/detalles/${id}.json`);
}

export async function fetchMapaEvolucionesLocal(): Promise<Map<string, string[]>> {
  const datos = await fetchLocal<Record<string, string[]>>('/data/mapa-evoluciones.json');
  return new Map(Object.entries(datos));
}
