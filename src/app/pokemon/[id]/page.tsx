import { redirect } from 'next/navigation';

export default async function PaginaDetalleRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/?pokemon=${id}`);
}
