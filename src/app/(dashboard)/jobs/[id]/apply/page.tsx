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
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="border-primary-main h-12 w-12 animate-spin rounded-full border-b-2" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    redirect("/job-seeker");
    return;
  }

  return (
    <div className="bg-neutral-20 h-svh w-screen overflow-hidden">
      <JobApplicationForm job={job} />
    </div>
  );
}
