import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Cliente con la service-role key: bypassa RLS, puede escribir.
// Solo se importa desde Server Actions / código que corre en el servidor
// ("server-only" hace fallar el build si algún Client Component lo importa).
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}
