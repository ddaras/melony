import { toast as melonyToast } from "@melony/ui";

export const toast = (
  message: string,
  data?: any & {
    description?: string;
    variant?: "success" | "error" | "warning" | "info" | "loading" | "default";
  }
) => {
  if (data?.variant === "success") {
    melonyToast.success(message, data);
  } else if (data?.variant === "error") {
    melonyToast.error(message, data);
  } else if (data?.variant === "warning") {
    melonyToast.warning(message, data);
  } else if (data?.variant === "info") {
    melonyToast.info(message, data);
  } else if (data?.variant === "loading") {
    melonyToast.loading(message, data);
  } else {
    melonyToast(message, data);
  }
};
