"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const DashboardNavbar = () => {
  const pathname = usePathname();

  const isJobDetailPage = pathname.startsWith("/jobs/") && pathname !== "/jobs";

  return (
    <header className="bg-neutral-10 border-neutral-40 max-w-container fixed top-0 left-1/2 z-50 flex h-16 w-full shrink-0 -translate-x-1/2 items-center justify-between border-b px-5 pt-2">
      {isJobDetailPage ? (
        <div className="text-m text-neutral-90 flex items-center gap-x-2">
          <Link href="/recruiter">
            <Button variant="neutral" size="medium" className="text-nowrap">
              Job List
            </Button>
          </Link>
          <ChevronRightIcon className="size-6 text-neutral-100" />
          <Button
            variant="disabled"
            size="medium"
            className="text-neutral-100!"
            border
          >
            Manage Candidate
          </Button>
        </div>
      ) : (
        <span className="text-xl-bold text-[#1E1F21]">Job List</span>
      )}

      <div className="flex items-center gap-x-2">
        <Image
          src="/assets/images/mas-kanye.webp"
          alt="profile picture"
          width={28}
          height={28}
          priority
          className="border-neutral-40 rounded-full border"
        />
        <form action="/api/auth/signout" method="post">
          <Button variant="primary" size="small" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
};

export default DashboardNavbar;
