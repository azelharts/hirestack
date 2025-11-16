"use client";

import { Button } from "@/components/button";
import { useJob, useJobs } from "@/queries/job";
import {
  BriefcaseIcon,
  CreditCardIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const JobList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    searchParams.get("selected-job")
  );

  // Fetch jobs using React Query
  const { data: jobs = [], isLoading: loading } = useJobs();

  // Fetch selected job details
  const { data: selectedJob, isLoading: loadingDetail } = useJob(
    selectedJobId || ""
  );

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredJobs.length > 0 && !selectedJobId && !loading) {
    setSelectedJobId(filteredJobs[0].id);
    router.push(`/job-seeker?selected-job=${filteredJobs[0].id}`, {
      scroll: true,
    });
  }

  const selectedJobExists = selectedJobId
    ? filteredJobs.some((job) => job.id === selectedJobId)
    : false;

  const formatSalary = (min: number, max: number) => {
    if (min === 0 && max === 0) return "Competitive salary";
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  return (
    <div className="pt-20 pb-4 px-6 max-w-container flex-1 flex flex-col">
      {/* Loading State */}
      {loading ? (
        <div className="flex flex-1 w-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center gap-y-4 justify-center">
          <Image
            src="/assets/images/empty-job.svg"
            alt="No jobs"
            width={306}
            height={300}
            priority
          />
          <div className="flex flex-col gap-y-1 items-center">
            <p className="heading-s-bold text-nuetral-90">
              No job openings available
            </p>
            <span className="text-l text-neutral-90">
              Please wait for the next batch of openings.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 gap-x-6 relative">
          {/* Left Side - Job List */}
          <div className="flex flex-col gap-y-4 min-w-fit max-h-[calc(100vh-100px)] overflow-y-auto pr-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJobId(job.id);
                  router.push(`/job-seeker?selected-job=${job.id}`, {
                    scroll: false,
                  });
                }}
                className={`w-full min-w-[384px] max-w-[384px] rounded-lg border-2 px-4 py-3 flex flex-col gap-y-2 cursor-pointer transition-all ${
                  selectedJobId === job.id
                    ? "border-primary-hover bg-primary-surface"
                    : "border-neutral-30 bg-neutral-10 hover:border-primary-focus hover:bg-primary-surface"
                }`}
              >
                {/* Company Profile */}
                <div className="flex items-start gap-x-4">
                  <Image
                    src="/assets/logo-rakamin-icon.png"
                    alt={`${job.company_name} company logo`}
                    width={48}
                    height={48}
                    className="rounded-sm aspect-square border border-neutral-40"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-l-bold text-neutral-90">
                      {job.job_name}
                    </h3>
                    <p className="text-m text-neutral-90">{job.company_name}</p>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px dashed-border-2" />

                {/* Job Detail */}
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-x-1">
                    <MapPinIcon className="size-4 text-neutral-80" />
                    <span className="text-s text-neutral-80">
                      Jakarta Selatan
                    </span>
                  </div>
                  <div className="flex items-center gap-x-1">
                    <CreditCardIcon className="size-4 text-neutral-80" />
                    <span className="text-s text-neutral-80">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Job Detail */}
          <div className="w-full max-h-[calc(100vh-100px)] rounded-lg border border-neutral-40 overflow-y-auto bg-white">
            {selectedJobId && selectedJobExists ? (
              <div className="p-6">
                {loadingDetail ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main" />
                  </div>
                ) : (
                  selectedJob && (
                    <div className="flex flex-col gap-y-6">
                      {/* existing job detail content stays the same */}
                      <div className="pb-6 flex justify-between items-start border-b border-neutral-4">
                        <div className="flex items-start gap-x-6">
                          <Image
                            src="/assets/logo-rakamin-icon.png"
                            alt={`${selectedJob.company_name} company logo`}
                            width={48}
                            height={48}
                            className="rounded-sm aspect-square border border-neutral-40"
                          />
                          <div className="flex flex-col gap-y-2">
                            <div className="rounded-sm py-0.5 px-2 bg-success-main text-s-bold text-neutral-10 w-fit">
                              {selectedJob.job_type}
                            </div>
                            <div className="flex flex-col">
                              <p className="text-xl-bold text-neutral-90">
                                {selectedJob.job_name}
                              </p>
                              <span className="text-m text-neutral-70">
                                {selectedJob.company_name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/jobs/${selectedJob.id}/apply`}>
                          <Button
                            variant="secondary"
                            size="medium"
                            className="w-fit"
                          >
                            Apply
                          </Button>
                        </Link>
                      </div>
                      <p className="text-m text-neutral-90">
                        {selectedJob.job_description}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
                <BriefcaseIcon className="w-16 h-16 text-neutral-40 mb-4" />
                <p className="text-l text-neutral-60">
                  Select a job to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
