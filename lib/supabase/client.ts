import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/config/env'; // We will rely on process.env directly here to keep it simple

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};