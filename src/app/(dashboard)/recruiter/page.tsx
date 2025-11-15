import { createClient } from "@/utils/supabase/server";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Dialog } from "@/components/ui/dialog";
import JobList from "./job-list";

const page = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Dialog>
      <div className="w-full min-h-screen flex flex-col">
        <DashboardNavbar />
        <JobList />
      </div>
    </Dialog>
  );
};

export default page;
