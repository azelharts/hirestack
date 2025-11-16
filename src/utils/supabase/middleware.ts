// Since Server Components can't write cookies, you need middleware to refresh expired Auth tokens and store them. This is accomplished by:

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            // Passing the refreshed Auth token to Server Components through request.cookies.set, so they don't attempt to refresh the same token themselves.
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            // Passing the refreshed Auth token to the browser, so it replaces the old token. This is done with response.cookies.set
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the Auth token with the call to supabase.auth.getUser.
  await supabase.auth.getUser();

  return supabaseResponse;
}
