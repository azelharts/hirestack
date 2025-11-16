import { Suspense } from "react";
import LogInForm from "./login-form";

const page = () => {
  return (
    <Suspense>
      <div className="bg-neutral-20 flex h-svh w-screen items-center justify-center">
        <LogInForm />
      </div>
    </Suspense>
  );
};

export default page;
