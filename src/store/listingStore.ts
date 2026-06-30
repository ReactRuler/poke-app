import { create } from 'zustand';
import type { EstadoListado } from '@/types/pokemon';

const LOTE_INICIAL = 25;

export const useListadoStore = create<EstadoListado>((set) => ({
  busqueda: '',
  filtroPorTipo: '',
  filtroPorGeneracion: null,
  soloFavoritos: false,
  soloVistos: false,

  setBusqueda: (valor) => set({ busqueda: valor }),

  setFiltroPorTipo: (tipo) => set({ filtroPorTipo: tipo }),

  setFiltroPorGeneracion: (gen) => set({ filtroPorGeneracion: gen }),

  setSoloFavoritos: (activo) => set({ soloFavoritos: activo }),

  setSoloVistos: (activo) => set({ soloVistos: activo }),

  resetearFiltros: () =>
    set({
      busqueda: '',
      filtroPorTipo: '',
      filtroPorGeneracion: null,
      soloFavoritos: false,
      soloVistos: false,
    }),
}));

export { LOTE_INICIAL };
