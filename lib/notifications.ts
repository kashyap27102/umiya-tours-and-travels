import { toast } from "sonner";

const baseStyle = {
  fontFamily: "inherit",
  fontSize: "14px",
  borderRadius: "12px",
};

export const notify = {
  success: (message: string, description?: string, toastId?: string | number) => {
    if (toastId) toast.dismiss(toastId);
    return toast.success(message, {
      description,
      duration: 4000,
      style: {
        ...baseStyle,
        backgroundColor: "#fdfef8",
        borderColor: "#4ea64f",
        color: "#1a2640",
        border: "1px solid #4ea64f",
      },
    });
  },

  error: (message: string, description?: string, toastId?: string | number) => {
    if (toastId) toast.dismiss(toastId);
    return toast.error(message, {
      description,
      duration: 5000,
      style: {
        ...baseStyle,
        backgroundColor: "#fdfef8",
        borderColor: "#ef4444",
        color: "#7f1d1d",
        border: "1px solid #ef4444",
      },
    });
  },

  loading: (message: string) =>
    toast.loading(message, {
      duration: Infinity,
      style: {
        ...baseStyle,
        backgroundColor: "#fdfef8",
        borderColor: "#2f6db5",
        color: "#1a2640",
        border: "1px solid #2f6db5",
      },
    }),

  info: (message: string, description?: string, toastId?: string | number) => {
    if (toastId) toast.dismiss(toastId);
    return toast.info(message, {
      description,
      duration: 4000,
      style: {
        ...baseStyle,
        backgroundColor: "#fdfef8",
        borderColor: "#2f6db5",
        color: "#1a2640",
        border: "1px solid #2f6db5",
      },
    });
  },

  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};
