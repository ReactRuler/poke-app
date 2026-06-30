'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LOTE_INICIAL } from '@/store/listingStore';

export const LOTE_POKEMON = LOTE_INICIAL;

export function useInfinitePokemon<T>(items: T[], claveFiltros: string) {
  const [cantidadVisible, setCantidadVisible] = useState(LOTE_POKEMON);
  const [cargandoMas, setCargandoMas] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const claveAnterior = useRef(claveFiltros);

  const hayMas = cantidadVisible < items.length;
  const visibles = items.slice(0, cantidadVisible);

  useEffect(() => {
    if (claveAnterior.current !== claveFiltros) {
      claveAnterior.current = claveFiltros;
      setCantidadVisible(LOTE_POKEMON);
    }
  }, [claveFiltros]);

  const cargarMas = useCallback(() => {
    if (cargandoMas || cantidadVisible >= items.length) return;

    setCargandoMas(true);
    requestAnimationFrame(() => {
      setCantidadVisible(prev => Math.min(prev + LOTE_POKEMON, items.length));
      setCargandoMas(false);
    });
  }, [cargandoMas, cantidadVisible, items.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hayMas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) cargarMas();
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cargarMas, hayMas]);

  return { visibles, cargandoMas, hayMas, sentinelRef, cantidadVisible, total: items.length };
}
