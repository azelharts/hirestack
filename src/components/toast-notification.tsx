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
      className={`w-fit rounded-lg border-l-4 p-4 gap-x-4 flex justify-between items-center bg-neutral-10 shadow-modal relative ${
        variant === "success" ? "border-primary-main" : "border-danger-main"
      }`}
    >
      <div className="flex items-center gap-x-2">
        {variant === "success" ? (
          <CheckCircleIcon className="size-5 text-primary-main" />
        ) : (
          <XCircleIcon className="size-5 text-danger-main" />
        )}
        <span className="text-m-bold text-neutral-90">{text}</span>
      </div>

      <button onClick={() => toast.dismiss(t)}>
        <XMarkIcon className="text-neutral-100 size-5" />
      </button>
    </div>
  );
};

export default ToastNotification;
