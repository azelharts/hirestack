import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Dialog } from "@/components/ui/dialog";
import JobList from "./job-list";

const page = async () => {
  const supabase = await createClient();

  // Check if user logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Redirect if not recruiter
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!profile || profile.role !== "recruiter") {
    redirect("/job-seeker?selected-job=none");
  }

  return (
    <Dialog>
      <div className="flex min-h-screen w-full flex-col">
        <DashboardNavbar />
        <JobList />
      </div>
    </Dialog>
  );
};

export default page;
