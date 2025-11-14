// Client Component client - To access Supabase from Client Components, which run in the browser.
import { createBrowserClient } from "@supabase/ssr";
import { TypedSupabaseClient } from "./types";
import { Database } from "./database.types";
import { useMemo } from "react";

let client: TypedSupabaseClient | undefined

function getSupabaseBrowserClient() {
  if(client){
    return client
  }

  // Create a supabase client on the browser with project's credentials
  client =  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  return client
}

export function createClient() {
  return useMemo(getSupabaseBrowserClient, [])
}
