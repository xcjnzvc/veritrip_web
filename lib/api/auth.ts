import axiosInstance from "../axiosInstance";
import { User } from "@/types/auth";

interface RefreshResponse {
  data: {
    accessToken: string;
  };
}

interface MeResponse<TUser = User> {
  data: TUser;
}

export const signin = async (name: string, email: string, password: string) => {
  try {
    const res = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    });
    console.log("singin", res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (loginId: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      loginId,
      password,
    });
    console.log("response", response);
    return response.data; // 서버에서 보내준 유저 정보나 토큰
  } catch (error) {
    // 에러를 위로 던져서 컴포넌트에서 처리하게 합니다.
    throw error;
  }
};

export const userInfo = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    console.log("userinfo", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshSession = async () => {
  const refreshResponse = await axiosInstance.post<RefreshResponse>("/auth/refresh");
  const meResponse = await axiosInstance.get<MeResponse>("/users/me");

  return {
    accessToken: refreshResponse.data.data.accessToken,
    user: meResponse.data.data,
  };
};
