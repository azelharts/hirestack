import Image from "next/image";
import Link from "next/link";

import { signup } from "./action";

import { CheckIcon } from "@heroicons/react/16/solid";

const page = () => {
  return (
    <div className="w-screen h-svh flex items-center justify-center">
      <div className="flex flex-col gap-y-6">
        <Image
          src="/assets/logo-rakamin.png"
          alt="logo rakamin"
          width={145}
          height={50}
          priority
        />

        <form className="w-[500px] p-10 flex flex-col gap-y-4 bg-neutral-10 shadow-button">
          <div className="flex flex-col gap-y-2">
            <p className="font-bold text-xl leading-[30px] text-neutral-90">
              Bergabung dengan Rakamin
            </p>
            <p className="text-m">
              Sudah punya akun?
              <Link href="/login" className="text-primary-main hover:underline">
                Masuk
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="email" className="text-s text-neutral-90 w-fit">
              Alamat email
            </label>
            {/* TODO: turn into component */}
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Masukkan email"
              required
              className="peer h-10 rounded-lg py-2 px-4 bg-neutral-10 border-2 border-neutral-40 text-m text-neutral-90 hover:border-primary-focus focus:outline-none focus:border-primary-main invalid:not-placeholder-shown:border-red-500"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
            <p className="hidden text-s text-danger-main peer-not-placeholder-shown:peer-invalid:block">
              Pastikan alamat email Anda benar (misal: nama@domain.com)
            </p>
            <div className="hidden text-s text-success-main peer-valid:flex items-center gap-x-1">
              <CheckIcon width={16} height={16} />
              <span>Alamat email teridentifikasi</span>
            </div>
          </div>

          {/* TODO: turn into component */}
          <button
            formAction={signup}
            className="rounded-lg py-1.5 px-4 bg-secondary-main hover:bg-secondary-hover shadow-button text-l-bold"
          >
            Daftar dengan email
          </button>

          <div className="flex items-center gap-x-3">
            <div className="h-px bg-neutral-60 grow" />
            <span className="text-xs leading-[18px] text-neutral-60">atau</span>
            <div className="h-px bg-neutral-60 grow" />
          </div>

          {/* TODO: turn into component */}
          <button className="rounded-lg py-3 px-6 bg-neutral-10 flex justify-center items-center gap-x-2.5 border-2 border-neutral-30 text-sm font-bold text-neutral-90 leading-[21px]">
            <Image
              src="/assets/icons/flat-color-icons_google.svg"
              alt=""
              width={24}
              height={24}
              priority
            />
            Daftar dengan Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
