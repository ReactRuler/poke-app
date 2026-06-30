export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const tamanos = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div
      className={`${tamanos[size]} border-4 border-gray-200 border-t-red-500 rounded-full animate-spin`}
      role="status"
      aria-label="Cargando"
    />
  );
}
