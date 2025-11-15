"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { User } from "@supabase/supabase-js";

const AccountForm = ({ user }: { user: User | null }) => {
  const supabase = createClient();
  return <div></div>;
};

export default AccountForm;
