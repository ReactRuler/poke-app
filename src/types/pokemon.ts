export interface PokemonListItem {
  id: number;
  nombre: string;
  imagen: string;
  tipos: string[];
  generacion: number;
  nombreGeneracion: string;
  speciesUrl: string;
}

export interface PokemonDetalle {
  id: number;
  nombre: string;
  imagen: string;
  imagenShiny: string;
  tipos: string[];
  generacion: number;
  nombreGeneracion: string;
  stats: Stat[];
  cadenaEvolutiva: EslabonEvolutivo[];
  altura: number;
  peso: number;
  habilidades: string[];
  descripcion: string;
}

export interface Stat {
  nombre: string;
  valor: number;
  base: number;
}

export interface EslabonEvolutivo {
  id: number;
  nombre: string;
  imagen: string;
}

export interface EstadoListado {
  busqueda: string;
  filtroPorTipo: string;
  filtroPorGeneracion: number | null;
  soloFavoritos: boolean;
  soloVistos: boolean;
  setBusqueda: (valor: string) => void;
  setFiltroPorTipo: (tipo: string) => void;
  setFiltroPorGeneracion: (gen: number | null) => void;
  setSoloFavoritos: (activo: boolean) => void;
  setSoloVistos: (activo: boolean) => void;
  resetearFiltros: () => void;
}

export interface PokemonApiRespuesta {
  count: number;
  results: { name: string; url: string }[];
}

export interface PokemonApiDetalle {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  species: { url: string };
}

export interface SpeciesApiRespuesta {
  generation: { name: string; url: string };
  evolution_chain: { url: string };
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

export interface EvolutionChainApiRespuesta {
  chain: NodoEvolutivo;
}

export interface NodoEvolutivo {
  species: { name: string; url: string };
  evolves_to: NodoEvolutivo[];
}
