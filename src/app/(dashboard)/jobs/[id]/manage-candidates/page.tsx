"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Dialog } from "@/components/ui/dialog";
import { use } from "react";
import CandidateManagement from "./candidate-management";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
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

export default Page;
