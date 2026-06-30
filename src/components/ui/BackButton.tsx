import Link from 'next/link';

interface Props {
  onClick?: () => void;
}

export function BackButton({ onClick }: Props) {
  const className =
    'inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer';

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        ← Volver al listado
      </button>
    );
  }

  return (
    <Link href="/" scroll={false} className={className}>
      ← Volver al listado
    </Link>
  );
}
