import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: Props) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
      {children}
    </span>
  );
}
