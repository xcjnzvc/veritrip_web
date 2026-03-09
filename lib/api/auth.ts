import axiosInstance from "../axiosInstance";

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
