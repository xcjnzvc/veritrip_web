import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
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

// 응답 인터셉터 - 401 나면 자동으로 refresh 후 재시도
axiosInstance.interceptors.response.use(
  (response) => response, // 성공은 그냥 통과
  async (error) => {
    const originalRequest = error.config;

    // 401이고 아직 재시도 안 했으면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한루프 방지

      try {
        // refreshToken 쿠키 자동으로 같이 전송됨 (withCredentials)
        const response = await axiosInstance.post("/auth/refresh");
        const newAccessToken = response.data.data.accessToken;

        // 새 토큰 Zustand에 저장
        useAuthStore.getState().setLogin(newAccessToken);

        // 실패했던 요청 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        // refresh도 실패 → 진짜 로그아웃
        useAuthStore.getState().setLogout();
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
