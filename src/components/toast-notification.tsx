import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

const ToastNotification = ({
  text,
  t,
  variant = "success",
}: {
  text: string;
  t: string | number;
  variant?: "success" | "error";
}) => {
  return (
    <div
      className={`bg-neutral-10 shadow-modal relative flex w-fit items-center justify-between gap-x-4 rounded-lg border-l-4 p-4 ${
        variant === "success" ? "border-primary-main" : "border-danger-main"
      }`}
    >
      <div className="flex items-center gap-x-2">
        {variant === "success" ? (
          <CheckCircleIcon className="text-primary-main size-5" />
        ) : (
          <XCircleIcon className="text-danger-main size-5" />
        )}
        <span className="text-m-bold text-neutral-90">{text}</span>
      </div>

      <button onClick={() => toast.dismiss(t)}>
        <XMarkIcon className="size-5 text-neutral-100" />
      </button>
    </div>
  );
};

export default ToastNotification;
