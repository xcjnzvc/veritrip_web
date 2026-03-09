import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mungs-day-api.onrender.com",
  // baseURL: "/api",
  timeout: 5000, // 5초 동안 응답 없으면 취소
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
