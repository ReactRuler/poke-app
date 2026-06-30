'use client';

import { useEffect } from 'react';
import { useUserProgressStore } from '@/store/userProgressStore';

// Hidrata favoritos/vistos desde localStorage al arrancar la app en cliente.
export function ProgressHydrator() {
  const hidratar = useUserProgressStore(s => s.hidratar);

  useEffect(() => {
    hidratar();
  }, [hidratar]);

  return null;
}
