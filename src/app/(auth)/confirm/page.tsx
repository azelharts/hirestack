import { Suspense } from "react";
import ConfirmEmail from "./confirm-email";

const page = () => {
  return (
    <Suspense>
      <div className="bg-neutral-20 flex h-svh w-screen items-center justify-center">
        <ConfirmEmail />
      </div>
    </Suspense>
  );
};

export default page;
