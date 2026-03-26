import { toast as sonnerToast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/lib/types/api";

const extractErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiResponse>;

  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (axiosError?.message) {
    return axiosError.message;
  }

  return "요청 처리 중 오류가 발생했습니다.";
};

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, { description }),

  error: (message: string, description?: string) =>
    sonnerToast.error(message, { description }),

  fromError: (error: unknown, fallbackMessage?: string) =>
    sonnerToast.error(fallbackMessage ?? extractErrorMessage(error), {
      description: extractErrorMessage(error) !== (fallbackMessage ?? extractErrorMessage(error))
        ? extractErrorMessage(error)
        : undefined,
    }),

  loading: (message: string) => sonnerToast.loading(message),

  dismiss: (id?: string | number) => sonnerToast.dismiss(id),

  promise: <T>(
    promiseFn: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) =>
    sonnerToast.promise(promiseFn, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    }),
};
