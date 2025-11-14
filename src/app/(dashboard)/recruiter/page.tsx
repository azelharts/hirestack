import { createClient } from "@/utils/supabase/server";

import DashboardNavbar from "@/components/dashboard-navbar";
import JobList from "./job-list";

const page = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="w-full min-h-screen flex flex-col">
      <DashboardNavbar />
      <div className="pt-20 pb-4 px-6 max-w-container flex-1 flex flex-col">
        <JobList user={user} />
      </div>
    </div>
  );
};

export default page;
