import { Suspense } from "react";
import LogInForm from "./login-form";

const page = () => {
  return (
    <Suspense>
      <div className="w-screen h-svh flex items-center justify-center bg-neutral-20">
        <LogInForm />
      </div>
    </Suspense>
  );
};

export default page;
