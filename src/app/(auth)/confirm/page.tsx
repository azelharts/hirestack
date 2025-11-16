import { Suspense } from "react";
import ConfirmEmail from "./confirm-email";

const page = () => {
  return (
    <Suspense>
      <div className="w-screen h-svh flex items-center justify-center bg-neutral-20">
        <ConfirmEmail />
      </div>
    </Suspense>
  );
};

export default page;
