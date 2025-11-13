"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { authFormValues, authSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "../action";

import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

const SignUpForm = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signup(formData);

    if (result.error) {
      setError(result.error as string);
      setLoading(false);
      return;
    }

    setEmailVerified(true);
    setLoading(false);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    router.push(
      `/confirm?email=${encodeURIComponent(result.data?.user?.email || "")}`
    );
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

          {/* TODO: turn into tags component */}
          {error && !emailVerified && (
            <Tag variant="danger" size="small">
              {error}{" "}
              <Link href="/login" className="text-s-bold hover:underline">
                Masuk
              </Link>
            </Tag>
          )}

          <TextField
            label="Alamat email"
            type="email"
            placeholder="Masukan email"
            disabled={loading}
            {...register("email")}
            state={
              errors.password
                ? "error"
                : loading
                ? "disabled"
                : passwordValue
                ? "success"
                : "default"
            }
            errorMessage={errors.email?.message}
            successMessage={
              emailVerified && emailValue
                ? "Alamat email teridentifikasi"
                : undefined
            }
          />

          <TextField
            label="Kata sandi"
            type="password"
            disabled={loading}
            placeholder="Masukan kata sandi"
            {...register("password")}
            state={
              errors.password
                ? "error"
                : loading
                ? "disabled"
                : passwordValue
                ? "success"
                : "default"
            }
            errorMessage={errors.password?.message}
          />

          <Button
            disabled={loading}
            variant={loading ? "disabled" : "secondary"}
            border={loading}
            size="large"
            shadow
            type="submit"
          >
            Daftar dengan email
          </Button>

          <div className="flex items-center gap-x-3">
            <div className="h-px bg-neutral-60 grow" />
            <span className="text-xs leading-[18px] text-neutral-60">atau</span>
            <div className="h-px bg-neutral-60 grow" />
          </div>

          <Button
            disabled={loading}
            variant={loading ? "disabled" : "neutral"}
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
