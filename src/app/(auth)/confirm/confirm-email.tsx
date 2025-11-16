"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

const ConfirmEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="shadow-modal bg-neutral-10 flex w-[500px] flex-col items-center gap-y-2 rounded-lg p-10">
      <div className="flex flex-col items-center gap-y-1">
        <p className="heading-m-bold text-neutral-90">Periksa Email Anda</p>
        <p className="text-s text-center">
          Kami sudah mengirimkan link register ke{" "}
          <span className="text-s-bold">{email}</span> yang berlaku dalam{" "}
          <span className="text-s-bold">30 menit</span>
        </p>
      </div>

      <div className="flex h-[184px] w-[184px] items-center justify-center">
        <Image
          src="/assets/images/confirm-email.svg"
          alt=""
          width={184}
          height={158}
          priority
        />
      </div>
    </div>
  );
};

export default ConfirmEmail;
