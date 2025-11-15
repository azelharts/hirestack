import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import AccountForm from "./account-form";

export default async function Account() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountForm user={user} />
    </HydrationBoundary>
  );
}
