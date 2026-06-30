'use client';

import { useEffect } from 'react';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { useUserProgressStore } from '@/store/userProgressStore';

interface Props {
  id: number;
  variant?: 'overlay' | 'banner' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TAMANOS = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-10 h-10',
};

export function FavoriteButton({
  id,
  variant = 'default',
  size = 'sm',
  className = '',
}: Props) {
  const hidratar = useUserProgressStore(s => s.hidratar);
  const esFavorito = useUserProgressStore(s => s.esFavorito(id));
  const toggleFavorito = useUserProgressStore(s => s.toggleFavorito);

  useEffect(() => {
    hidratar();
  }, [hidratar]);

  const enColores = variant === 'overlay' || variant === 'banner';

  const colorCorazon = esFavorito
    ? 'text-red-500'
    : enColores
      ? 'text-white'
      : 'text-gray-300';

  return (
    <button
      type="button"
      aria-label={esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorito(id);
      }}
      className={`inline-flex shrink-0 items-center justify-center p-1 transition-transform hover:scale-110 cursor-pointer drop-shadow-md ${colorCorazon} ${className}`}
    >
      <HeartIcon
        className={TAMANOS[size]}
        filled={esFavorito}
        whiteBorder={enColores}
      />
    </button>
  );
}
