"use client";

import { createClient } from "@/utils/supabase/client";
import { getCountryById } from "@/queries/get-country-by-id";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getJobById } from "@/queries/get-job-by-id";
import { User } from "@supabase/supabase-js";

const AccountForm = ({ user }: { user: User | null }) => {
  const supabase = createClient();

  const { data: country } = useQuery(getCountryById(supabase, 3));

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery(getCountryById(supabase, 1));

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
