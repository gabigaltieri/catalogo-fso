import { getCatalog } from '@/lib/queries';
import AdminApp from './AdminApp';

// Siempre dinámico: el admin necesita ver el estado más reciente,
// nunca una versión cacheada/estática de la página.
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const catalog = await getCatalog();
  return <AdminApp catalog={catalog} />;
}
