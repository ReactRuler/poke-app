import { mkdir, writeFile, access, readFile, readdir } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import {
  fetchListadoCompleto,
  fetchDetallePokemon,
  fetchSpecies,
  fetchCadenaEvolutiva,
  obtenerGeneracionPorId,
} from '../src/lib/pokeapi';
import { aplanarCadenaEvolutiva } from '../src/lib/evolution';
import { NOMBRES_STATS_ES } from '../src/lib/utils';
import type { PokemonListItem, PokemonDetalle, NodoEvolutivo } from '../src/types/pokemon';

const STORAGE_ROOT = process.env.POKEAPP_STORAGE;
const BASE_DIR = STORAGE_ROOT ?? path.join(process.cwd(), 'public');
const DATA_DIR = path.join(BASE_DIR, 'data');
const DETALLES_DIR = path.join(DATA_DIR, 'detalles');
const IMAGES_DIR = path.join(BASE_DIR, 'pokemon');
const LISTADO_PATH = path.join(DATA_DIR, 'listado.json');
const MAPA_PATH = path.join(DATA_DIR, 'mapa-evoluciones.json');
const TOTAL_CADENAS = 542;
const LOTE = 50;
const FORCE = process.argv.includes('--force');

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function downloadImage(id: number, urls: string[]): Promise<boolean> {
  const dest = path.join(IMAGES_DIR, `${id}.png`);
  if (!FORCE && (await exists(dest))) return true;

  for (const url of urls) {
    if (!url) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 100) continue;
      await writeFile(dest, buffer);
      return true;
    } catch {
      continue;
    }
  }

  return false;
}

function urlsImagenPorId(id: number): string[] {
  return [
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
  ];
}

function obtenerUrlsImagen(detalle: Awaited<ReturnType<typeof fetchDetallePokemon>>, id: number): string[] {
  return [
    detalle.sprites.other['official-artwork'].front_default,
    detalle.sprites.front_default,
    ...urlsImagenPorId(id),
  ];
}

function construirDetalle(
  id: number,
  detalle: Awaited<ReturnType<typeof fetchDetallePokemon>>,
  species: Awaited<ReturnType<typeof fetchSpecies>>,
  cadenaApi: Awaited<ReturnType<typeof fetchCadenaEvolutiva>>
): PokemonDetalle {
  const descripcionEs = species.flavor_text_entries.find(e => e.language.name === 'es');
  const descripcionEn = species.flavor_text_entries.find(e => e.language.name === 'en');
  const descripcion = (descripcionEs || descripcionEn)?.flavor_text.replace(/\n|\f/g, ' ') ?? '';
  const { numero: numGen, nombre: nombreGen } = obtenerGeneracionPorId(id);
  const imagenLocal = `/pokemon/${id}.png`;

  return {
    id,
    nombre: detalle.name,
    imagen: imagenLocal,
    imagenShiny: detalle.sprites.other['official-artwork'].front_shiny || '',
    tipos: detalle.types.map(t => t.type.name),
    generacion: numGen,
    nombreGeneracion: nombreGen,
    stats: detalle.stats.map(s => ({
      nombre: NOMBRES_STATS_ES[s.stat.name] || s.stat.name,
      valor: s.base_stat,
      base: s.base_stat,
    })),
    cadenaEvolutiva: aplanarCadenaEvolutiva(cadenaApi.chain).map(eslabon => ({
      ...eslabon,
      imagen: `/pokemon/${eslabon.id}.png`,
    })),
    altura: detalle.height,
    peso: detalle.weight,
    habilidades: detalle.abilities.filter(a => !a.is_hidden).map(a => a.ability.name),
    descripcion,
  };
}

async function construirMapaEvoluciones(): Promise<Record<string, string[]>> {
  const mapa: Record<string, string[]> = {};

  for (let i = 1; i <= TOTAL_CADENAS; i += LOTE) {
    const ids = Array.from({ length: Math.min(LOTE, TOTAL_CADENAS - i + 1) }, (_, k) => i + k);
    const cadenas = await Promise.allSettled(
      ids.map(id => fetchCadenaEvolutiva(`https://pokeapi.co/api/v2/evolution-chain/${id}`))
    );

    for (const resultado of cadenas) {
      if (resultado.status !== 'fulfilled') continue;

      const cadena = resultado.value;
      const todosLosNombres: string[] = [];
      function recorrer(nodo: NodoEvolutivo) {
        todosLosNombres.push(nodo.species.name);
        for (const evo of nodo.evolves_to) recorrer(evo);
      }
      recorrer(cadena.chain);

      for (const nombre of todosLosNombres) {
        mapa[nombre] = todosLosNombres;
      }
    }

    process.stdout.write(`\rMapa evolutivo: ${Math.min(i + LOTE - 1, TOTAL_CADENAS)}/${TOTAL_CADENAS}`);
  }

  process.stdout.write('\n');
  return mapa;
}

async function contarImagenes(): Promise<number> {
  try {
    const archivos = await readdir(IMAGES_DIR);
    return archivos.filter(n => n.endsWith('.png')).length;
  } catch {
    return 0;
  }
}

async function obtenerIdsConImagen(listado: PokemonListItem[]): Promise<Set<number>> {
  const ids = new Set<number>();

  for (const pokemon of listado) {
    ids.add(pokemon.id);
    const detallePath = path.join(DETALLES_DIR, `${pokemon.id}.json`);
    if (!(await exists(detallePath))) continue;
    const detalle = JSON.parse(await readFile(detallePath, 'utf-8')) as PokemonDetalle;
    for (const eslabon of detalle.cadenaEvolutiva) {
      ids.add(eslabon.id);
    }
  }

  return ids;
}

async function imagenesCompletas(listado: PokemonListItem[]): Promise<boolean> {
  const ids = await obtenerIdsConImagen(listado);
  const conteo = await contarImagenes();
  if (conteo < ids.size) return false;

  for (const id of [1, 25, 150, listado[listado.length - 1]?.id]) {
    if (id && !(await exists(path.join(IMAGES_DIR, `${id}.png`)))) return false;
  }

  return true;
}

async function sincronizarImagenes(listado: PokemonListItem[]): Promise<void> {
  await mkdir(IMAGES_DIR, { recursive: true });
  const ids = [...(await obtenerIdsConImagen(listado))].sort((a, b) => a - b);
  let descargadas = 0;
  let fallidas = 0;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const dest = path.join(IMAGES_DIR, `${id}.png`);
    if (!FORCE && (await exists(dest))) continue;

    const ok = await downloadImage(id, urlsImagenPorId(id));
    if (ok) descargadas++;
    else fallidas++;

    if ((i + 1) % 25 === 0 || i === ids.length - 1) {
      process.stdout.write(`\rImágenes: ${i + 1}/${ids.length}`);
    }
  }

  process.stdout.write('\n');
  console.log(`Imágenes: ${descargadas} descargadas, ${fallidas} fallidas, ${await contarImagenes()} en total.`);
}

export async function ensurePokemonData(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(DETALLES_DIR, { recursive: true });
  await mkdir(IMAGES_DIR, { recursive: true });

  let listado: PokemonListItem[] = [];
  if (await exists(LISTADO_PATH)) {
    listado = JSON.parse(await readFile(LISTADO_PATH, 'utf-8'));
  }

  const jsonOk = Array.isArray(listado) && listado.length >= 1000 && (await exists(MAPA_PATH));

  if (!FORCE && jsonOk && process.env.POKEAPP_STORAGE) {
    console.log(`Datos en almacenamiento remoto listos (${listado.length} Pokémon).`);
    return;
  }

  const imagesOk = jsonOk && (await imagenesCompletas(listado));

  if (!FORCE && jsonOk && imagesOk) {
    console.log(`Datos locales listos (${listado.length} Pokémon, ${await contarImagenes()} imágenes).`);
    return;
  }

  if (!FORCE && jsonOk && !imagesOk) {
    console.log('JSON listo pero faltan imágenes, descargando artwork local...');
    await sincronizarImagenes(listado);
    return;
  }

  if (!FORCE && (await exists(LISTADO_PATH))) {
    console.log('Datos incompletos, reanudando descarga...');
  } else if (FORCE) {
    console.log('Forzando nueva descarga de datos...');
  } else {
    console.log('Primera ejecución: descargando datos de PokéAPI (puede tardar varios minutos)...');
  }

  console.log('Descargando mapa de evoluciones...');
  const mapaEvoluciones = await construirMapaEvoluciones();
  await writeFile(MAPA_PATH, JSON.stringify(mapaEvoluciones));

  console.log('Descargando listado de Pokémon...');
  const listaBasica = await fetchListadoCompleto();
  listado = [];
  const idsEvolucion = new Set<number>();

  for (const cadena of Object.values(mapaEvoluciones)) {
    for (const nombre of cadena) {
      const pokemon = listaBasica.find(p => p.nombre === nombre);
      if (pokemon) idsEvolucion.add(pokemon.id);
    }
  }

  for (let i = 0; i < listaBasica.length; i += LOTE) {
    const lote = listaBasica.slice(i, i + LOTE);
    const detalles = await Promise.all(lote.map(p => fetchDetallePokemon(p.id)));
    const speciesList = await Promise.all(lote.map(p => fetchSpecies(p.id)));
    const cadenas = await Promise.all(
      speciesList.map(s => fetchCadenaEvolutiva(s.evolution_chain.url))
    );

    for (let idx = 0; idx < lote.length; idx++) {
      const { id, nombre } = lote[idx];
      const detalle = detalles[idx];
      const species = speciesList[idx];
      const cadena = cadenas[idx];
      const { numero, nombre: nombreGen } = obtenerGeneracionPorId(id);

      await downloadImage(id, obtenerUrlsImagen(detalle, id));

      const pokemonDetalle = construirDetalle(id, detalle, species, cadena);
      await writeFile(path.join(DETALLES_DIR, `${id}.json`), JSON.stringify(pokemonDetalle));

      listado.push({
        id,
        nombre,
        imagen: `/pokemon/${id}.png`,
        tipos: detalle.types.map(t => t.type.name),
        generacion: numero,
        nombreGeneracion: nombreGen,
        speciesUrl: detalle.species.url,
      });

      for (const eslabon of pokemonDetalle.cadenaEvolutiva) {
        idsEvolucion.add(eslabon.id);
      }
    }

    for (const evoId of idsEvolucion) {
      if (evoId <= 0 || listado.some(p => p.id === evoId)) continue;
      if (!(await exists(path.join(IMAGES_DIR, `${evoId}.png`)))) {
        const evoDetalle = await fetchDetallePokemon(evoId);
        await downloadImage(evoId, obtenerUrlsImagen(evoDetalle, evoId));
      }
    }

    process.stdout.write(`\rPokémon: ${Math.min(i + LOTE, listaBasica.length)}/${listaBasica.length}`);
  }

  process.stdout.write('\n');

  listado.sort((a, b) => a.id - b.id);
  await writeFile(LISTADO_PATH, JSON.stringify(listado));

  console.log(`JSON completo: ${listado.length} Pokémon, ${Object.keys(mapaEvoluciones).length} entradas evolutivas.`);
  await sincronizarImagenes(listado);
  console.log('Sincronización completa.');
}
