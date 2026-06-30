import type { NodoEvolutivo, EslabonEvolutivo } from '@/types/pokemon';
import { extraerIdDeUrl, obtenerImagenPorId } from './pokeapi';

export function aplanarCadenaEvolutiva(nodo: NodoEvolutivo): EslabonEvolutivo[] {
  const resultado: EslabonEvolutivo[] = [];

  function recorrer(nodoActual: NodoEvolutivo) {
    const id = extraerIdDeUrl(nodoActual.species.url);
    resultado.push({
      id,
      nombre: nodoActual.species.name,
      imagen: obtenerImagenPorId(id),
    });
    for (const evolucion of nodoActual.evolves_to) {
      recorrer(evolucion);
    }
  }

  recorrer(nodo);
  return resultado;
}

export function obtenerNombresFamiliaEvolutiva(
  nombre: string,
  nodo: NodoEvolutivo
): string[] {
  const todosLosNombres: string[] = [];

  function recorrer(nodoActual: NodoEvolutivo) {
    todosLosNombres.push(nodoActual.species.name);
    for (const evolucion of nodoActual.evolves_to) {
      recorrer(evolucion);
    }
  }

  recorrer(nodo);

  if (todosLosNombres.includes(nombre)) {
    return todosLosNombres;
  }
  return [];
}
