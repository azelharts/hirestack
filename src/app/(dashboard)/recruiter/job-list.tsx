"use client";

import { useState } from "react";

import Image from "next/image";

import { Button } from "@/components/button";
import { TextField } from "@/components/text-field";
import { DialogTrigger } from "@/components/ui/dialog";

import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  PencilIcon,
  PowerIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import CreateJobForm from "./create-job-form";

import { Tag } from "@/components/tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteJob, useJobs, useUpdateJob } from "@/queries/job";
import Link from "next/link";

import ToastNotification from "@/components/toast-notification";
import { formatDate, formatSalaryRange } from "@/lib/utils";
import { toast } from "sonner";

const JobList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter] = useState<string>("all");

  // Fetch current recruiter's job
  const { data: jobs = [], isLoading } = useJobs({
    myJobs: true,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const deleteMutation = useDeleteJob();
  const updateMutation = useUpdateJob();

  const handleDelete = async (jobId: string) => {
    deleteMutation.mutate(jobId, {
      onSuccess: () => {
        toast.custom((t) => (
          <ToastNotification text="Job vacancy successfully deleted" t={t} />
        ));
      },

      onError: (error) => {
        toast.custom((t) => (
          <ToastNotification
            variant="error"
            text={
              error instanceof Error ? error.message : "Failed to update job"
            }
            t={t}
          />
        ));
      },
    });
  };

  const handleStatusChange = (
    jobId: string,
    newStatus: "active" | "inactive",
  ) => {
    updateMutation.mutate(
      {
        jobId,
        updates: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.custom((t) => (
            <ToastNotification text="Job vacancy successfully updated" t={t} />
          ));
        },

        onError: (error) => {
          toast.custom((t) => (
            <ToastNotification
              variant="error"
              text={
                error instanceof Error ? error.message : "Failed to update job"
              }
              t={t}
            />
          ));
        },
      },
    );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="max-w-container flex flex-1 flex-col px-6 pt-20 pb-4">
        <div className="relative flex flex-1 gap-x-6">
          {/* Left */}
          <div className="flex flex-1 flex-col gap-y-2">
            {/* Search */}
            <TextField
              type="text"
              placeholder="Search by job details"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative flex w-full items-center"
              rightIcon={
                <MagnifyingGlassIcon className="text-primary-main h-6 w-6" />
              }
            />

            {/* Empty job list */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="border-primary-main h-12 w-12 animate-spin rounded-full border-b-2" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
                <Image
                  src="/assets/images/empty-job.svg"
                  alt=""
                  width={306}
                  height={300}
                  priority
                />
                <div className="text-neutral-90 flex flex-col items-center gap-y-1">
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
                    className="shadow-modal flex flex-col gap-y-3 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between">
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
                        <div className="border-neutral-40 text-m text-neutral-90 rounded-sm border px-4 py-1">
                          Started on {formatDate(job.created_at)}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="hover:bg-neutral-20 border-neutral-40 rounded-lg border p-1 transition-colors focus:outline-none active:outline-none">
                            <EllipsisVerticalIcon className="text-neutral-70 h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <button className="bg-neutral-30 text-neutral-60 pointer-events-none flex w-full cursor-not-allowed items-center gap-x-2">
                              <PencilIcon className="text-neutral-60 h-4 w-4" />
                              Edit Job
                            </button>
                          </DropdownMenuItem>
                          {job.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(job.id, "inactive")
                              }
                            >
                              <NoSymbolIcon className="h-4 w-4" />
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
                            <TrashIcon className="text-danger-main h-4 w-4" />
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

                      <Link href={`/jobs/${job.id}/manage-candidates`}>
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
          <div className="sticky top-20 flex h-fit w-[300px] flex-col gap-y-6 overflow-hidden rounded-2xl p-6">
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
              className="-z-50 object-cover brightness-25"
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
