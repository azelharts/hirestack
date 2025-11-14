import Image from "next/image";

import { type User } from "@supabase/supabase-js";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";

const JobList = ({ user }: { user: User | null }) => {
  return (
    <>
      <div className="flex flex-1 gap-x-6 relative">
        {/* Left */}
        <div className="flex flex-1 flex-col">
          {/* Search */}
          <TextField
            type="text"
            placeholder="Cari berdasarkan detail pekerjaan"
            className="w-full relative flex items-center"
            rightIcon={
              <MagnifyingGlassIcon className="w-6 h-6 text-primary-main" />
            }
          />
          {/* Empty job list */}
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
            <Button variant="secondary" size="large" className="w-fit">
              Create a new job
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-y-6 rounded-2xl w-[300px] p-6 sticky top-20 h-fit overflow-hidden s">
          <p className="text-xl-bold text-neutral-40">
            Recruit the best candidates
          </p>
          <p className="text-m-bold text-neutral-10">
            Create jobs, invite, and hire with ease
          </p>
          <Button variant="primary" size="large">
            Create a new job
          </Button>
          <div />
          <Image
            src="/assets/images/create-job.jpg"
            alt=""
            fill
            className="object-cover brightness-25 -z-50"
          />
        </div>
      </div>
    </>
  );
};

export default JobList;
