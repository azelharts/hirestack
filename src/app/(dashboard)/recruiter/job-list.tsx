"use client";

import { useState } from "react";

import Image from "next/image";

import { Button } from "@/components/button";
import { TextField } from "@/components/text-field";
import { DialogTrigger } from "@/components/ui/dialog";

import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  PencilIcon,
  PowerIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CreateJobForm from "./create-job-form";

import { Database } from "@/utils/supabase/database.types";
import { useDeleteJob, useJobs, useUpdateJob } from "@/queries/job";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Tag } from "@/components/tag";

import { formatDate, formatSalaryRange } from "@/lib/utils";
import { toast } from "sonner";

type Job = Database["public"]["Tables"]["jobs"]["Row"] & {
  application_count?: { count: number }[];
};

const statusColors = {
  active: "bg-success-main text-white",
  inactive: "bg-neutral-60 text-white",
  draft: "bg-warning-main text-neutral-100",
};

const statusLabels = {
  active: "Active",
  inactive: "Inactive",
  draft: "Draft",
};

const JobList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch current recruiter's job
  const { data: jobs = [], isLoading } = useJobs({
    myJobs: true,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const deleteMutation = useDeleteJob();
  const updateMutation = useUpdateJob();

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    deleteMutation.mutate(jobId);
  };

  const handleStatusChange = (
    jobId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateMutation.mutate(
      {
        jobId,
        updates: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <div className="w-fit rounded-lg border-l-4 p-4 gap-x-4 flex justify-between items-center bg-neutral-10 border-primary-main shadow-modal relative">
              <div className="flex items-center gap-x-2">
                <CheckCircleIcon className="size-5 text-primary-main" />
                <span className="text-m-bold text-neutral-90">
                  Job vacancy updated successfully
                </span>
              </div>

              <button onClick={() => toast.dismiss(t)}>
                <XMarkIcon className="text-neutral-100 size-5" />
              </button>
            </div>
          ));
        },

        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to update job"
          );
        },
      }
    );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getApplicationCount = (job: Job) => {
    return job.application_count?.[0]?.count || 0;
  };

  console.log(jobs);

  return (
    <>
      <div className="pt-20 pb-4 px-6 max-w-container flex-1 flex flex-col">
        <div className="flex flex-1 gap-x-6 relative">
          {/* Left */}
          <div className="flex flex-1 flex-col gap-y-2">
            {/* Search */}
            <TextField
              type="text"
              placeholder="Search by job details"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full relative flex items-center"
              rightIcon={
                <MagnifyingGlassIcon className="w-6 h-6 text-primary-main" />
              }
            />

            {/* Empty job list */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col flex-1 items-center justify-center gap-y-4">
                <Image
                  src="/assets/images/empty-job.svg"
                  alt=""
                  width={306}
                  height={300}
                  priority
                />
                <div className="flex flex-col items-center gap-y-1 text-neutral-90">
                  <p className="heading-s-bold">No job opening available</p>
                  <p className="text-l">
                    Create a job opening now and start the candidate process.
                  </p>
                </div>

                <DialogTrigger asChild>
                  <Button variant="secondary" size="large" className="w-fit">
                    Create a new job
                  </Button>
                </DialogTrigger>
              </div>
            ) : (
              <div className="flex flex-col gap-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 flex flex-col gap-y-3 rounded-xl shadow-modal"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-x-4">
                        <Tag
                          variant={
                            job.status === "active"
                              ? "success"
                              : job.status === "draft"
                              ? "secondary"
                              : "danger"
                          }
                          size="medium"
                          className="font-bold capitalize"
                        >
                          {job.status}
                        </Tag>
                        <div className="rounded-sm border py-1 px-4 border-neutral-40 text-m text-neutral-90">
                          Started on {formatDate(job.created_at)}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-neutral-20 rounded-lg transition-colors border border-neutral-40 focus:outline-none active:outline-none">
                            <EllipsisVerticalIcon className="w-4 h-4 text-neutral-70" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/jobs/${job.id}/edit`}
                              className="flex items-center gap-x-2"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit Job
                            </Link>
                          </DropdownMenuItem>
                          {job.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, "inactive")
                              }
                            >
                              <NoSymbolIcon className="w-4 h-4" />
                              Deactivate Job
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, "active")
                              }
                            >
                              <PowerIcon />
                              Activate Job
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(job.id)}
                            className="text-danger-main focus:text-danger-main"
                          >
                            <TrashIcon className="w-4 h-4 text-danger-main" />
                            Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex flex-col gap-y-3">
                        <p className="text-xl-bold text-neutral-100">
                          {job.job_name}
                        </p>
                        <div className="text-l text-neutral-80">
                          {formatSalaryRange(job.salary_min, job.salary_max)}
                        </div>
                      </div>

                      <Link href={`/jobs/${job.id}/candidates`}>
                        <Button variant="primary" size="small">
                          Manage Job
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-y-6 rounded-2xl w-[300px] p-6 sticky top-20 h-fit overflow-hidden">
            <p className="text-xl-bold text-neutral-40">
              Recruit the best candidates
            </p>
            <p className="text-m-bold text-neutral-10">
              Create jobs, invite, and hire with ease
            </p>

            <DialogTrigger asChild>
              <Button variant="primary" size="large">
                Create a new job
              </Button>
            </DialogTrigger>

            <div />
            <Image
              src="/assets/images/mas-kanye.webp"
              alt=""
              fill
              priority
              className="object-cover brightness-25 -z-50"
            />
          </div>
        </div>
      </div>

      {/* Job Form */}
      <CreateJobForm />
    </>
  );
};

export default JobList;
