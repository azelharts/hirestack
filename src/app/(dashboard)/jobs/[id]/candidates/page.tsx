import { createClient } from "@/utils/supabase/server";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Dialog } from "@/components/ui/dialog";
import CandidateManagement from "./candidate-management";

const page = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Dialog>
      <div className="w-full min-h-screen flex flex-col">
        <DashboardNavbar />
        <CandidateManagement />
      </div>
    </Dialog>
  );
};

export default page;
