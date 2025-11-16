"use client";

import { useJob } from "@/queries/job";
import JobApplicationForm from "./job-application-form";
import { use } from "react";
import { redirect } from "next/navigation";

export default function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: job, isLoading, error } = useJob(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    redirect("/job-seeker");
    return;
  }

  return (
    <div className="w-screen h-svh bg-neutral-20 overflow-hidden">
      <JobApplicationForm job={job} />
    </div>
  );
}
