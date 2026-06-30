import { create } from 'zustand';

const CLAVE_STORAGE = 'pokeapp-progreso';

interface ProgresoPersistido {
  favoritos: number[];
  vistos: number[];
}

interface UserProgressState {
  favoritos: number[];
  vistos: number[];
  hidratado: boolean;
  hidratar: () => void;
  esFavorito: (id: number) => boolean;
  esVisto: (id: number) => boolean;
  toggleFavorito: (id: number) => void;
  marcarVisto: (id: number) => void;
}

function cargarProgreso(): ProgresoPersistido {
  if (typeof window === 'undefined') return { favoritos: [], vistos: [] };
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE);
    if (!raw) return { favoritos: [], vistos: [] };
    const datos = JSON.parse(raw) as ProgresoPersistido;
    return {
      favoritos: Array.isArray(datos.favoritos) ? datos.favoritos : [],
      vistos: Array.isArray(datos.vistos) ? datos.vistos : [],
    };
  } catch {
    return { favoritos: [], vistos: [] };
  }
}

function guardarProgreso(favoritos: number[], vistos: number[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify({ favoritos, vistos }));
}

// Favoritos y Pokémon vistos persistidos en localStorage (independiente del listado).
export const useUserProgressStore = create<UserProgressState>((set, get) => ({
  favoritos: [],
  vistos: [],
  hidratado: false,

  hidratar: () => {
    if (get().hidratado) return;
    const datos = cargarProgreso();
    set({ ...datos, hidratado: true });
  },

  esFavorito: (id) => get().favoritos.includes(id),

  esVisto: (id) => get().vistos.includes(id),

  toggleFavorito: (id) => {
    const { favoritos, vistos } = get();
    const actualizados = favoritos.includes(id)
      ? favoritos.filter(f => f !== id)
      : [...favoritos, id];
    guardarProgreso(actualizados, vistos);
    set({ favoritos: actualizados });
  },

  marcarVisto: (id) => {
    const { favoritos, vistos } = get();
    if (vistos.includes(id)) return;
    const actualizados = [...vistos, id];
    guardarProgreso(favoritos, actualizados);
    set({ vistos: actualizados });
  },
}));
