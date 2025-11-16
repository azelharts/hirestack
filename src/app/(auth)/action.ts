"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  // if user exist but is fake. The identities array is empty only for a confirmed user. If a user has registered but not yet confirmed, then you still get a non empty identities array in response and in which case you would have overridden the password of the non confirmed user now.
  if (error || data?.user?.identities?.length === 0) {
    return {
      error: "Email ini sudah terdaftar sebagai akun di Rakamin Academy.",
    };
  }

  // revalidatePath("/", "layout");
  // redirect(`/confirm?email=${encodeURIComponent(email)}`);

  return { data: data };
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error)
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/recruiter");
}

export async function loginWithoutPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo:
        `${process.env.NEXT_PUBLIC_SITE_URL}/recruiter` ||
        "http://localhost:3000",
    },
  });

  if (error) {
    console.error("Supabase signInWithOtp error:", error.message);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect(`/confirm?email=${encodeURIComponent(email)}`);
}


