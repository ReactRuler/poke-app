import type { PokemonApiRespuesta, PokemonApiDetalle, SpeciesApiRespuesta, EvolutionChainApiRespuesta } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export function extraerIdDeUrl(url: string): number {
  const partes = url.replace(/\/$/, '').split('/');
  return parseInt(partes[partes.length - 1], 10);
}

export function obtenerImagenPorId(id: number): string {
  return `/pokemon/${id}.png`;
}

export const GENERACIONES: { numero: number; nombre: string; rangoIds: [number, number] }[] = [
  { numero: 1, nombre: 'Generación I', rangoIds: [1, 151] },
  { numero: 2, nombre: 'Generación II', rangoIds: [152, 251] },
  { numero: 3, nombre: 'Generación III', rangoIds: [252, 386] },
  { numero: 4, nombre: 'Generación IV', rangoIds: [387, 493] },
  { numero: 5, nombre: 'Generación V', rangoIds: [494, 649] },
  { numero: 6, nombre: 'Generación VI', rangoIds: [650, 721] },
  { numero: 7, nombre: 'Generación VII', rangoIds: [722, 809] },
  { numero: 8, nombre: 'Generación VIII', rangoIds: [810, 905] },
  { numero: 9, nombre: 'Generación IX', rangoIds: [906, 1025] },
];

export function obtenerGeneracionPorId(id: number): { numero: number; nombre: string } {
  const gen = GENERACIONES.find(g => id >= g.rangoIds[0] && id <= g.rangoIds[1]);
  return gen ? { numero: gen.numero, nombre: gen.nombre } : { numero: 0, nombre: 'Desconocida' };
}

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Error al obtener: ${url} — status ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchListadoCompleto(): Promise<{ nombre: string; id: number }[]> {
  const datos = await fetchApi<PokemonApiRespuesta>(`${BASE_URL}/pokemon?limit=1025&offset=0`);
  return datos.results.map(p => ({
    nombre: p.name,
    id: extraerIdDeUrl(p.url),
  }));
}

export async function fetchDetallePokemon(id: number): Promise<PokemonApiDetalle> {
  return fetchApi<PokemonApiDetalle>(`${BASE_URL}/pokemon/${id}`);
}

export async function fetchSpecies(id: number): Promise<SpeciesApiRespuesta> {
  return fetchApi<SpeciesApiRespuesta>(`${BASE_URL}/pokemon-species/${id}`);
}

export async function fetchCadenaEvolutiva(url: string): Promise<EvolutionChainApiRespuesta> {
  return fetchApi<EvolutionChainApiRespuesta>(url);
}

export async function fetchTipos(): Promise<string[]> {
  const datos = await fetchApi<{ results: { name: string }[] }>(`${BASE_URL}/type`);
  return datos.results
    .map(t => t.name)
    .filter(nombre => nombre !== 'unknown' && nombre !== 'shadow');
}
