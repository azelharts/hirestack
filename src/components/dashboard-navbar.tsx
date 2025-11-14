import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardNavbar = () => {
  return (
    <header className="w-full h-16 bg-neutral-10 flex justify-between items-center px-5 pt-2 border-b border-neutral-40 max-w-container shrink-0  fixed top-0 left-1/2 -translate-x-1/2 z-50">
      <span className="text-xl-bold text-[#1E1F21]">Job List</span>
      <Link href="/profile">
        <Image
          src="/assets/images/mas-kanye.webp"
          alt="profile picture"
          width={28}
          height={28}
          priority
          className="border border-neutral-40 rounded-full"
        />
      </Link>
    </header>
  );
};

export default DashboardNavbar;
