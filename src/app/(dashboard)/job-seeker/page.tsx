import { createClient } from "@/utils/supabase/server";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Dialog } from "@/components/ui/dialog";
import JobList from "./job-list";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const page = async () => {
  const supabase = await createClient();

  // Check if user logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Redirect if not job seeker
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!profile || profile.role !== "job_seeker") {
    redirect("/recruiter");
  }

  return (
    <Suspense>
      <Dialog>
        <div className="flex min-h-screen w-full flex-col">
          <DashboardNavbar />
          <JobList />
        </div>
      </Dialog>
    </Suspense>
  );
};

export default page;
