"use client";

import { Button } from "@/components/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="bg-neutral-20 flex h-svh w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <Image
          src="/assets/images/application-success.svg"
          alt=""
          width={214}
          height={214}
          className="object-cover"
        />
        <div className="text-neutral-90 flex flex-col items-center text-center">
          <p className="heading-m-bold">🎉 Your application was sent!</p>
          <p className="text-l max-w-[606px]">
            Congratulations! You&apos;ve taken the first step towards a
            rewarding career at Rakamin. We look forward to learning more about
            you during the application process.
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

export default Page;
