import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/lib/toast";
import type { ApiResponse } from "@/lib/types/api";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 자동 첨부
});

// 요청 인터셉터 - 모든 요청에 accessToken 자동으로 헤더에 담기
axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "잘못된 요청입니다.",
  403: "접근 권한이 없습니다.",
  404: "요청한 리소스를 찾을 수 없습니다.",
  409: "이미 존재하는 데이터입니다.",
  422: "입력값을 확인해 주세요.",
  500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  502: "서버와 연결할 수 없습니다.",
  503: "서비스를 일시적으로 사용할 수 없습니다.",
};

// 응답 인터셉터 - 401 나면 자동으로 refresh 후 재시도 / 그 외 에러는 toast로 표시
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status: number | undefined = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");

    // refresh 요청 자체가 401이면 재귀 refresh를 막고 즉시 실패 처리
    if (status === 401 && isRefreshRequest) {
      useAuthStore.getState().setLogout();
      return Promise.reject(error);
    }

    // 401이고 아직 재시도 안 했으면
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post("/auth/refresh");
        const newAccessToken = response.data.data.accessToken;

        useAuthStore.getState().setLogin(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        useAuthStore.getState().setLogout();
      }
    }

    // toast 자동 표시 (401은 위에서 처리했으므로 제외)
    const skipToast = originalRequest?._skipToast === true || status === 401;
    if (!skipToast && status !== undefined) {
      const serverMessage = (error.response?.data as ApiResponse)?.message;
      const message = serverMessage ?? HTTP_ERROR_MESSAGES[status] ?? "요청이 실패했습니다.";
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
