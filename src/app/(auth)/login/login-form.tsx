"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  passwordlessAuthFormValues,
  passwordlessAuthSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginWithoutPassword } from "../action";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Tag } from "@/components/ui/tag";

import { KeyIcon } from "@heroicons/react/24/outline";

const LogInForm = () => {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");

    if (errorParam === "expired") {
      setErrorMessage(
        "Tautan konfirmasi sudah kedaluwarsa. Silakan daftar ulang atau minta tautan baru."
      );
    } else if (errorParam === "invalid_link") {
      setErrorMessage("Tautan tidak valid.");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<passwordlessAuthFormValues>({
    resolver: zodResolver(passwordlessAuthSchema),
    mode: "onChange",
  });

  const emailValue = watch("email") || "";

  const onSubmit = async (data: passwordlessAuthFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    await loginWithoutPassword(formData);
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
              Masuk dengan Rakamin
            </p>
            <p className="text-m">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-primary-main hover:underline"
              >
                Daftar menggunakan email
              </Link>
            </p>
          </div>

          {/* TODO: turn into tags component */}
          {errorMessage && (
            <Tag variant="danger" size="small">
              Link <span className="text-s-bold">sudah kadaluarsa.</span>{" "}
              Silahkan login kembali!
            </Tag>
          )}

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

          <Button variant="secondary" size="large" shadow type="submit">
            Kirim link
          </Button>

          <div className="flex items-center gap-x-3">
            <div className="h-px bg-neutral-60 grow" />
            <span className="text-xs leading-[18px] text-neutral-60">atau</span>
            <div className="h-px bg-neutral-60 grow" />
          </div>

          <Link href="/login/password">
            <Button
              variant="neutral"
              size="large"
              border
              type="button"
              className="gap-x-2.5 text-sm"
            >
              <KeyIcon width={16} height={16} color="#111827" />
              "Masuk dengan kata sandi"
            </Button>
          </Link>

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

export default LogInForm;
