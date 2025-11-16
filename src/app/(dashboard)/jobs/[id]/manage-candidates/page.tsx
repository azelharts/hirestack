"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Dialog } from "@/components/ui/dialog";
import { use } from "react";
import CandidateManagement from "./candidate-management";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: jobId } = use(params);

  return (
    <Dialog>
      <div className="flex min-h-screen w-full flex-col">
        <DashboardNavbar />
        <CandidateManagement jobId={jobId} />
      </div>
    </Dialog>
  );
};

export default Page;
