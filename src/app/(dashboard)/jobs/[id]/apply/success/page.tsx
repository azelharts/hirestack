"use client";

import { Button } from "@/components/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div className="w-screen h-svh flex items-center justify-center bg-neutral-20">
      <div className="flex flex-col gap-y-4 items-center">
        <Image
          src="/assets/images/application-success.svg"
          alt=""
          width={214}
          height={214}
          className="object-cover"
        />
        <div className="flex flex-col items-center text-center text-neutral-90">
          <p className="heading-m-bold">🎉 Your application was sent!</p>
          <p className="text-l max-w-[606px]">
            Congratulations! You've taken the first step towards a rewarding
            career at Rakamin. We look forward to learning more about you during
            the application process.
          </p>
        </div>
        <Button
          variant="primary"
          size="medium"
          onClick={() => {
            router.push(`/job-seeker?selected-job=none`);
          }}
          className="w-fit"
        >
          Job List
        </Button>
      </div>
    </div>
  );
};

export default page;
