"use client";

import { createClient } from "@/utils/supabase/client";
import { getCountryById } from "@/queries/get-country-by-id";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getJobById } from "@/queries/get-job-by-id";
import { User } from "@supabase/supabase-js";

const AccountForm = ({ user }: { user: User | null }) => {
  const supabase = createClient();

  // --- SERVER FETCHED QUERY (hydrated) ---
  const { data: country } = useQuery(getCountryById(supabase, 3));

  // --- CLIENT FETCHED QUERY (CSR only) ---
  const {
    data: job,
    isLoading,
    isError,
  } = useQuery(
    getCountryById(supabase, 1) // no hydration, runs on client
  );

  return (
    <div>
      <div>Fetched from server (hydrated): {country?.name}</div>

      <div>
        Fetched from client:
        {isLoading ? " Loading..." : job?.name ?? "No job found"}
      </div>
    </div>
  );
};

export default AccountForm;
