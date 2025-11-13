"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

const ConfirmEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="w-[500px] shadow-modal rounded-lg p-10 flex flex-col items-center gap-y-2 bg-neutral-10">
      <div className="flex flex-col gap-y-1 items-center">
        <p className="heading-m-bold text-neutral-90">Periksa Email Anda</p>
        <p className="text-s text-center">
          Kami sudah mengirimkan link register ke{" "}
          <span className="text-s-bold">{email}</span> yang berlaku dalam{" "}
          <span className="text-s-bold">30 menit</span>
        </p>
      </div>

      <div className="flex items-center justify-center w-[184px] h-[184px]">
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
