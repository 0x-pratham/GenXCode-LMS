
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const maintenanceMode =
    process.env.MAINTENANCE_MODE === 'true';

  const pathname = request.nextUrl.pathname;

  // Allow the maintenance page itself to load.
  if (maintenanceMode) {
    if (pathname === '/maintenance') {
      return NextResponse.next();
    }

    // Block API mutations and Server Actions.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new NextResponse('Service temporarily unavailable.', {
        status: 503,
        headers: {
          'Retry-After': '3600',
        },
      });
    }

    // Show maintenance page for every other route.
    return NextResponse.rewrite(
      new URL('/maintenance', request.url),
      { status: 503 }
    );
  }

  // Normal application behaviour when maintenance is disabled.
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
