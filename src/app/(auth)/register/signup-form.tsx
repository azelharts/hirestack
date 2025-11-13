"use client";

import Image from "next/image";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { authFormValues, authSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "../action";

import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<authFormValues>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  const emailValue = watch("email") || "";
  const passwordValue = watch("password") || "";

  const onSubmit = async (data: authFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    await signup(formData);
  };

  return (
    <div>
      <div className="flex flex-col gap-y-6">
        <Image
          src="/assets/logo-rakamin.png"
          alt="logo rakamin"
          width={145}
          height={50}
          className="w-[145px] h-[50px] object-cover"
          priority
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[500px] p-10 flex flex-col gap-y-4 bg-neutral-10 shadow-modal"
        >
          <div className="flex flex-col gap-y-2">
            <p className="font-bold text-xl leading-[30px] text-neutral-90">
              Bergabung dengan Rakamin
            </p>
            <p className="text-m">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary-main hover:underline">
                Masuk
              </Link>
            </p>
          </div>

          <TextField
            label="Alamat email"
            type="email"
            placeholder="Masukan email"
            {...register("email")}
            state={errors.email ? "error" : emailValue ? "success" : "default"}
            errorMessage={errors.email?.message}
            successMessage={
              !errors.email && emailValue
                ? "Alamat email teridentifikasi"
                : undefined
            }
          />

          <TextField
            label="Kata sandi"
            type="password"
            placeholder="Masukan kata sandi"
            {...register("password")}
            state={
              errors.password ? "error" : passwordValue ? "success" : "default"
            }
            errorMessage={errors.password?.message}
          />

          <Button variant="secondary" size="large" shadow type="submit">
            Daftar dengan email
          </Button>

          <div className="flex items-center gap-x-3">
            <div className="h-px bg-neutral-60 grow" />
            <span className="text-xs leading-[18px] text-neutral-60">atau</span>
            <div className="h-px bg-neutral-60 grow" />
          </div>

          <Button
            variant="neutral"
            size="large"
            border
            type="button"
            className="gap-x-2.5 text-sm"
          >
            <Image
              src="/assets/icons/flat-color-icons_google.svg"
              alt="Google icon"
              width={24}
              height={24}
              priority
            />
            Daftar dengan Google
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
