"use client";

import { createClient } from "@/utils/supabase/server";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Dialog } from "@/components/ui/dialog";
import CandidateManagement from "./candidate-management";
import { use } from "react";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: jobId } = use(params);

  return (
    <Dialog>
      <div className="w-full min-h-screen flex flex-col">
        <DashboardNavbar />
        <CandidateManagement jobId={jobId} />
      </div>
    </Dialog>
  );
};

export default page;
