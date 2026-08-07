import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';

function supabaseConfiguration() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)?.trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)?.trim();
  if (!url || !key) throw new Error('Supabase authentication is not configured');
  return {url, key};
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const {url, key} = supabaseConfiguration();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({name, value, options}) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies. Route handlers own refresh writes.
        }
      },
    },
  });
}
